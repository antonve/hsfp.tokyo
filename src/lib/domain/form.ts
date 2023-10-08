import { VisaType, Category } from '@lib/domain'

import { Qualification } from './qualifications'

export interface FormProgress {
  qualifications: Qualification[]
  currentCategoryIndex: number
  currentPromptIndex: number
}

export interface Form {
  visa: VisaType
  sections: FormSection[]
}

export interface FormSection {
  category: Category
  prompts: Prompt[]
}

export interface Prompt {
  id: string
  type: 'CHOICE' | 'NUMBER'
  options?: string[]
}
