import { VisaType } from '@lib/domain'
import { z } from 'zod'
import {
  ResearcherQualificationsSchema,
  calculatePoints as calculatePointsResearcher,
} from '@lib/domain/visa.researcher'
import {
  EngineerQualificationsSchema,
  calculatePoints as calculatePointsEngineer,
} from '@lib/domain/visa.engineer'
import {
  BusinessManagerQualificationsSchema,
  calculatePoints as calculatePointsBusinessManager,
} from '@lib/domain/visa.businessmanager'

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

export function calculatePoints(q: Qualifications) {
  switch (q.v) {
    case VisaType.Researcher:
      return calculatePointsResearcher(q)
    case VisaType.Engineer:
      return calculatePointsEngineer(q)
    case VisaType.BusinessManager:
      return calculatePointsBusinessManager(q)
  }
}
