import { Criteria } from '@lib/domain/criteria'
import { Qualifications } from '@lib/domain/qualifications'

export interface MatchResult {
  matches: Criteria[]
  points: number
}

export const calculatePoints = (
  matchers: Matcher[],
  qualifications: Qualifications,
): MatchResult => {
  return matchers
    .map(match => match(qualifications))
    .reduce(
      (accumulator, current) => {
        return {
          matches: accumulator.matches.concat(current.matches),
          points: accumulator.points + current.points,
        }
      },
      {
        matches: [],
        points: 0,
      } as MatchResult,
    )
}

export type Matcher = (q: Qualifications) => MatchResult
