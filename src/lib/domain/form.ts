import { Category } from '@lib/domain/qualifications'
import { Qualification } from '@lib/domain/qualifications'

export interface FormProgress {
  qualifications: Qualification[]
  currentCategory: Category
  currentPromptIndex: number
}

export interface FormConfig {
  // Definitions of each form section
  // Prompts will be shown in the order as defined.
  sections: Partial<Record<Category, Prompt[]>>

  // The order sections should be shown
  order: Category[]
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
  qualificationValueFieldName: string
}

export interface BooleanPrompt {
  id: string
  type: 'BOOLEAN'
}
