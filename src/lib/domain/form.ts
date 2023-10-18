import { z } from 'zod'
import { VisaType } from '@lib/domain'

// TODO: decide how to split the sections
export const SectionNameSchema = z.enum([
  'academic-background',
  'job',
  'research-achievements',
  'licenses',
  'bonus',
  // 'contracting-organization',
  // 'japanese',
  // 'university',
  // 'investor',
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
