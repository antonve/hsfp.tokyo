import {
  ResearcherQualificationsSchema,
  formConfig as formConfigA,
} from '@lib/visa/a'
import {
  EngineerQualificationsSchema,
  formConfig as formConfigB,
} from '@lib/visa/b'
// import { formConfig as formConfigC } from '@lib/visa/c'
import { z } from 'zod'

export function formConfigForVisa(visa: string) {
  switch (visa) {
    case 'researcher':
      return formConfigA
    case 'engineer':
      return formConfigB
    // case 'business-manager':
    // return formConfigC
  }
}

// v = visa (A = researcher, B = engineer, C = business manager)
// Kept short so the hash of the qualifications stays short
export const QualificationsSchema = z.union([
  ResearcherQualificationsSchema.extend({ v: z.literal('A') }),
  EngineerQualificationsSchema.extend({ v: z.literal('B') }),
])
export type Qualifications = z.infer<typeof QualificationsSchema>

export function decodeQualifications(raw: string) {
  const qualifications = JSON.parse(atob(raw))
  return QualificationsSchema.parse(qualifications)
}

export function encodeQualifications(qualifications: Qualifications) {
  return btoa(JSON.stringify(qualifications))
}
