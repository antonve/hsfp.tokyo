import { VisaType } from '@lib/domain'
import {
  ResearcherQualificationsSchema,
  formConfig as formConfigA,
} from '@lib/visa/visa.researcher'
import {
  EngineerQualificationsSchema,
  formConfig as formConfigB,
} from '@lib/visa/visa.engineer'
import {
  BusinessManagerQualificationsSchema,
  formConfig as formConfigC,
} from '@lib/visa/visa.businessmanager'
import { z } from 'zod'

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

// v = visa (A = researcher, B = engineer, C = business manager)
// Kept short so the hash of the qualifications stays short
export const QualificationsSchema = z.union([
  ResearcherQualificationsSchema.extend({
    v: z.literal(VisaType.Researcher),
    completed: z.number().optional().default(0),
  }),
  EngineerQualificationsSchema.extend({
    v: z.literal(VisaType.Engineer),
    completed: z.number().optional().default(0),
  }),
  BusinessManagerQualificationsSchema.extend({
    v: z.literal(VisaType.BusinessManager),
    completed: z.number().optional().default(0),
  }),
])
export type Qualifications = z.infer<typeof QualificationsSchema>

export function decodeQualifications(raw: string) {
  const qualifications = JSON.parse(atob(raw))
  return QualificationsSchema.parse(qualifications)
}

export function encodeQualifications(qualifications: Qualifications) {
  return btoa(JSON.stringify(qualifications))
}
