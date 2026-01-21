import { z } from 'zod'
import { VisaType } from '@lib/domain'
import { formConfig as formConfigBusinessManager } from '@lib/domain/visa.businessmanager'
import { formConfig as formConfigEngineer } from '@lib/domain/visa.engineer'
import { formConfig as formConfigResearcher } from '@lib/domain/visa.researcher'
import { Qualifications } from '@lib/domain/qualifications'
import { isPromptCompleted } from '@lib/domain/prompts'
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
}

export interface NumberPrompt {
  id: string
  type: 'NUMBER'
  config: NumberPromptConfig
  faqCount?: number
  maxPoints?: number
}

export interface BooleanPrompt {
  id: string
  type: 'BOOLEAN'
  faqCount?: number
  maxPoints?: number
}

export interface NumberPromptConfig {
  min?: number
  max?: number
  hideLabel?: boolean
}

export function nextStepOfForm(formConfig: FormConfig, progress: VisaProgress) {
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

export function previousStepOfForm(
  formConfig: FormConfig,
  progress: VisaProgress,
) {
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
  const totalPrompts = Object.values(config.order).reduce(
    (accumulator, value) => accumulator + (config.sections[value] ?? []).length,
    0,
  )
  const completedPrompts = [...Array(totalPrompts)]
    .map((_, promptId) => isPromptCompleted(promptId, qualifications))
    .filter(isCompleted => isCompleted)

  const progressPercentage = (completedPrompts.length / totalPrompts) * 100

  return progressPercentage
}
