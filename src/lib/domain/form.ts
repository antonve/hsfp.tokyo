import { VisaType } from '@lib/domain/visa'
import { z } from 'zod'

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
