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

/**
 * Generates a unique session ID for tracking evidence state across qualifications
 */
export function generateSessionId(): string {
  return crypto.randomUUID()
}

// v = visa (A = researcher, B = engineer, C = business manager)
// s = session ID (for evidence tracking in localStorage)
// Kept short so the hash of the qualifications stays short
export const QualificationsSchema = z.union([
  ResearcherQualificationsSchema.extend({
    v: z.literal(VisaType.Researcher),
    completed: z.number().optional().default(0),
    s: z.string().optional(),
  }),
  EngineerQualificationsSchema.extend({
    v: z.literal(VisaType.Engineer),
    completed: z.number().optional().default(0),
    s: z.string().optional(),
  }),
  BusinessManagerQualificationsSchema.extend({
    v: z.literal(VisaType.BusinessManager),
    completed: z.number().optional().default(0),
    s: z.string().optional(),
  }),
])
export type Qualifications = z.infer<typeof QualificationsSchema>

export function decodeQualifications(raw: string) {
  const qualifications = JSON.parse(atob(raw))
  return QualificationsSchema.parse(qualifications)
}

export function encodeQualifications(qualifications: Qualifications) {
  // Ensure sessionId exists
  const qualificationsWithSession = {
    ...qualifications,
    s: qualifications.s || generateSessionId(),
  }
  return btoa(JSON.stringify(qualificationsWithSession))
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
