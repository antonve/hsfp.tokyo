import { z } from 'zod'
import { VisaType } from '@lib/domain'
import { formConfig as formConfigA } from '@lib/domain/visa.businessmanager'
import { formConfig as formConfigB } from '@lib/domain/visa.engineer'
import { formConfig as formConfigC } from '@lib/domain/visa.researcher'

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
}

export interface NumberPrompt {
  id: string
  type: 'NUMBER'
}

export interface BooleanPrompt {
  id: string
  type: 'BOOLEAN'
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

  return {
    section,
    promptIndex,
  } as VisaProgress
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
      return formConfigA
    case 'engineer':
      return formConfigB
    case 'business-manager':
      return formConfigC
  }
}
