import { Criteria } from './criteria'
import { Qualification } from './qualifications'

export interface SimulationResult {
  matches: Criteria[]
  points: number
}

export const calculatePoints = (
  matchers: CategoryMatcher[],
  qualifications: Qualification[],
): SimulationResult => {
  return matchers
    .map(group => group.match(group.criteria, qualifications))
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
      } as SimulationResult,
    )
}

// Some criteria are grouped together and need to be scored together.
// CriteriaMatcher is a group of criteria with an associated match function to get a final score.
export interface CategoryMatcher {
  criteria: Criteria[]
  match: (
    criteria: Criteria[],
    qualifications: Qualification[],
  ) => SimulationResult
}
