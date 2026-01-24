import { VisaType } from '@lib/domain'
import { Qualifications } from '@lib/domain/qualifications'

export interface CapGroup {
  id: string
  cap: number
  promptIds: string[]
  pointsPerPrompt: number
}

export const capGroups: Record<VisaType, CapGroup[]> = {
  [VisaType.Engineer]: [
    {
      id: 'research',
      cap: 15,
      promptIds: [
        'patent_inventor',
        'conducted_financed_projects',
        'published_papers',
        'recognized_research',
      ],
      pointsPerPrompt: 15,
    },
    {
      id: 'university_ranking',
      cap: 10,
      promptIds: ['uni_ranked', 'uni_funded', 'uni_partner'],
      pointsPerPrompt: 10,
    },
  ],
  [VisaType.Researcher]: [
    {
      id: 'research',
      cap: 25,
      promptIds: [
        'patent_inventor',
        'conducted_financed_projects',
        'published_papers',
        'recognized_research',
      ],
      pointsPerPrompt: 20,
    },
    {
      id: 'university_ranking',
      cap: 10,
      promptIds: ['uni_ranked', 'uni_funded', 'uni_partner'],
      pointsPerPrompt: 10,
    },
  ],
  [VisaType.BusinessManager]: [
    {
      id: 'university_ranking',
      cap: 10,
      promptIds: ['uni_ranked', 'uni_funded', 'uni_partner'],
      pointsPerPrompt: 10,
    },
  ],
}

/**
 * Get the total points accumulated in a cap group based on current qualifications.
 */
export function getCapGroupPoints(
  qualifications: Qualifications,
  capGroup: CapGroup,
): number {
  let points = 0
  for (const promptId of capGroup.promptIds) {
    const value = (qualifications as Record<string, unknown>)[promptId]
    if (value === true) {
      points += capGroup.pointsPerPrompt
    }
  }
  return points
}

/**
 * Check if a cap group has reached its maximum points.
 */
export function isCapGroupMaxed(
  qualifications: Qualifications,
  capGroup: CapGroup,
): boolean {
  return getCapGroupPoints(qualifications, capGroup) >= capGroup.cap
}

/**
 * Find the cap group that contains a given prompt ID for a visa type.
 */
export function findCapGroupForPrompt(
  promptId: string,
  visaType: VisaType,
): CapGroup | undefined {
  const groups = capGroups[visaType]
  return groups.find(group => group.promptIds.includes(promptId))
}

/**
 * Check if a prompt should be skipped because its cap group is already maxed.
 * A prompt is skipped if:
 * 1. It belongs to a cap group
 * 2. The cap group is already maxed
 * 3. The prompt itself hasn't been answered "yes" (we don't skip prompts that contributed to maxing)
 */
export function shouldSkipPrompt(
  promptId: string,
  visaType: VisaType,
  qualifications: Qualifications,
): boolean {
  const capGroup = findCapGroupForPrompt(promptId, visaType)
  if (!capGroup) {
    return false
  }

  // Don't skip if this prompt was answered "yes" (it contributed to the cap)
  const value = (qualifications as Record<string, unknown>)[promptId]
  if (value === true) {
    return false
  }

  return isCapGroupMaxed(qualifications, capGroup)
}
