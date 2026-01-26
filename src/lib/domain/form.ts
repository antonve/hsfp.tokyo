import { z } from 'zod'
import { VisaType } from '@lib/domain'
import { formConfig as formConfigBusinessManager } from '@lib/domain/visa.businessmanager'
import { formConfig as formConfigEngineer } from '@lib/domain/visa.engineer'
import { formConfig as formConfigResearcher } from '@lib/domain/visa.researcher'
import { Qualifications } from '@lib/domain/qualifications'
import { isPromptCompleted } from '@lib/domain/prompts'
import { shouldSkipPrompt } from '@lib/domain/caps'
import { ReactElement } from 'react'

export const SectionNameSchema = z.enum([
  'education',
  'job',
  'research',
  'bonus',
  'employer',
  'university',
  'position',
])

export interface VisaProgress {
  section: SectionName
  promptIndex: number
}

export type SectionName = z.infer<typeof SectionNameSchema>

export interface FormConfig {
  visaType: VisaType

  // Definitions of each form section
  // Prompts will be shown in the order as defined.
  sections: Partial<Record<SectionName, Prompt[]>>

  // The order sections should be shown
  order: SectionName[]
}

export type Prompt = ChoicePrompt | NumberPrompt | BooleanPrompt

export interface ChoicePrompt {
  id: string
  type: 'CHOICE'
  options: string[]
  faqCount?: number
  maxPoints?: number
  required?: boolean
}

export interface NumberPrompt {
  id: string
  type: 'NUMBER'
  config: NumberPromptConfig
  faqCount?: number
  maxPoints?: number
  required?: boolean
}

export interface BooleanPrompt {
  id: string
  type: 'BOOLEAN'
  faqCount?: number
  maxPoints?: number
  required?: boolean
}

export interface NumberPromptConfig {
  min?: number
  max?: number
  hideLabel?: boolean
}

/**
 * Compute the raw next step without considering skipped prompts.
 */
function computeNextStep(
  formConfig: FormConfig,
  progress: VisaProgress,
): { section: SectionName; promptIndex: number; finished: boolean } {
  const currentSection = formConfig.sections[progress.section]!!
  const shouldUseNextCategory =
    currentSection.length <= progress.promptIndex + 1
  const promptIndex = shouldUseNextCategory ? 0 : progress.promptIndex + 1
  const currentCategoryIndex = formConfig.order.findIndex(
    it => it === progress.section,
  )
  const section = shouldUseNextCategory
    ? formConfig.order[currentCategoryIndex + 1]
    : progress.section

  const finished = promptIndex >= (formConfig.sections[section]?.length ?? 0)

  return {
    section,
    promptIndex,
    finished,
  }
}

export function nextStepOfForm(
  formConfig: FormConfig,
  progress: VisaProgress,
  qualifications?: Qualifications,
) {
  let result = computeNextStep(formConfig, progress)

  // Skip prompts where cap group is maxed
  while (!result.finished && qualifications) {
    const prompt = formConfig.sections[result.section]?.[result.promptIndex]
    if (
      !prompt ||
      !shouldSkipPrompt(prompt.id, formConfig.visaType, qualifications)
    ) {
      break
    }
    // Advance to next prompt
    result = computeNextStep(formConfig, result)
  }

  return result
}

/**
 * Compute the raw previous step without considering skipped prompts.
 */
function computePreviousStep(
  formConfig: FormConfig,
  progress: VisaProgress,
): { section: SectionName; promptIndex: number; isFirst: boolean } {
  const sectionIndex = formConfig.order.indexOf(progress.section)

  if (progress.promptIndex > 0) {
    return {
      section: progress.section,
      promptIndex: progress.promptIndex - 1,
      isFirst: false,
    }
  }

  if (sectionIndex > 0) {
    const prevSection = formConfig.order[sectionIndex - 1]
    const prevSectionPrompts = formConfig.sections[prevSection]?.length ?? 0
    return {
      section: prevSection,
      promptIndex: prevSectionPrompts - 1,
      isFirst: false,
    }
  }

  return {
    section: progress.section,
    promptIndex: progress.promptIndex,
    isFirst: true,
  }
}

export function previousStepOfForm(
  formConfig: FormConfig,
  progress: VisaProgress,
  qualifications?: Qualifications,
) {
  let result = computePreviousStep(formConfig, progress)

  // Skip prompts where cap group is maxed
  while (!result.isFirst && qualifications) {
    const prompt = formConfig.sections[result.section]?.[result.promptIndex]
    if (
      !prompt ||
      !shouldSkipPrompt(prompt.id, formConfig.visaType, qualifications)
    ) {
      break
    }
    // Go back to previous prompt
    result = computePreviousStep(formConfig, result)
  }

  return result
}

export function getOverallPromptIndex(
  formConfig: FormConfig,
  section: SectionName,
  promptIndex: number,
) {
  const promptCounts = formConfig.order.map(
    sectionName => formConfig.sections[sectionName]?.length ?? 0,
  )
  const cumulativePromptCounts = [0, ...promptCounts].map(
    (
      sum => value =>
        (sum += value)
    )(0),
  )

  const promptsBeforeSection = Object.fromEntries(
    formConfig.order.map((sectionName, i) => [
      sectionName,
      cumulativePromptCounts[i],
    ]),
  )

  return promptsBeforeSection[section] + promptIndex
}

export function formConfigForVisa(visa: string) {
  switch (visa) {
    case 'researcher':
      return formConfigResearcher
    case 'engineer':
      return formConfigEngineer
    case 'business-manager':
      return formConfigBusinessManager
  }
}

export function getFormProgress(
  config: FormConfig,
  qualifications: Qualifications,
) {
  let totalPrompts = 0
  let completedPrompts = 0
  let overallIndex = 0

  for (const sectionName of config.order) {
    const prompts = config.sections[sectionName] ?? []
    for (const prompt of prompts) {
      totalPrompts++

      const isCompleted = isPromptCompleted(overallIndex, qualifications)
      const isSkipped = shouldSkipPrompt(
        prompt.id,
        config.visaType,
        qualifications,
      )

      // Count as completed if either actually completed or skipped due to cap group
      if (isCompleted || isSkipped) {
        completedPrompts++
      }

      overallIndex++
    }
  }

  const progressPercentage =
    totalPrompts > 0 ? (completedPrompts / totalPrompts) * 100 : 0

  return progressPercentage
}
