import { Qualification } from './domain/qualifications'
import { matchersForVisaB } from './visa/b'
import { matchersForVisaC } from './visa/c'

// The different types of HSP visas
// TODO: Rename from A | B | C to more generic name
export enum VisaType {
  // Advanced academic research activities
  A = 'A',
  // Advanced specialized/technical activities
  B = 'B',
  // Advanced business management activities
  C = 'C',
}

// A Criteria is a row in the HSP points table.
// The points will be added to when a qualification matches with a criteria.
export interface Criteria {
  id: string
  points: number
  match?: (value: any) => boolean
}

// Some criteria are grouped together and need to be scored together.
// CriteriaMatcher is a group of criteria with an associated match function to get a final score.
// TODO: Maybe a better name for this would be CategoryMatcher
export interface CriteriaMatcher {
  criteria: Criteria[]
  match: (
    criteria: Criteria[],
    qualifications: Qualification[],
  ) => SimulationResult
}

// Qualifications are linked to a Category and a whole category should be scored together.
// Each visa type has slight variations of what categories are available.
// Forms are also generated based on these types.
export type Category =
  | 'ACADEMIC_BACKGROUND'
  | 'CAREER'
  | 'AGE'
  | 'ANNUAL_SALARY'
  | 'RESEARCH_ACHIEVEMENTS'
  | 'POSITION'
  | 'LICENSES'
  | 'SPECIAL'
  | 'SPECIAL_CONTRACTING_ORGANIZATION'
  | 'SPECIAL_JAPANESE'
  | 'SPECIAL_UNIVERSITY'
  | 'SPECIAL_INVESTOR'

export type CategoryVisaA =
  | 'ACADEMIC_BACKGROUND'
  | 'CAREER'
  | 'AGE'
  | 'ANNUAL_SALARY'
  | 'RESEARCH_ACHIEVEMENTS'
  | 'SPECIAL'
  | 'SPECIAL_CONTRACTING_ORGANIZATION'
  | 'SPECIAL_JAPANESE'
  | 'SPECIAL_UNIVERSITY'

export type CategoryVisaB =
  | 'ACADEMIC_BACKGROUND'
  | 'CAREER'
  | 'AGE'
  | 'ANNUAL_SALARY'
  | 'RESEARCH_ACHIEVEMENTS'
  | 'LICENSES'
  | 'SPECIAL'
  | 'SPECIAL_CONTRACTING_ORGANIZATION'
  | 'SPECIAL_JAPANESE'
  | 'SPECIAL_UNIVERSITY'

export type CategoryVisaC =
  | 'ACADEMIC_BACKGROUND'
  | 'CAREER'
  | 'ANNUAL_SALARY'
  | 'POSITION'
  | 'SPECIAL'
  | 'SPECIAL_CONTRACTING_ORGANIZATION'
  | 'SPECIAL_JAPANESE'
  | 'SPECIAL_UNIVERSITY'

export const mapById = (objects: { id: string }[]) => {
  return objects.reduce((accumulator, current) => {
    accumulator[current.id] = current
    return accumulator
  }, {} as { [key: string]: any })
}

export interface Simulation {
  visaType: VisaType
  qualifications: Qualification[]
}

export interface SimulationResult {
  matches: Criteria[]
  points: number
}

export const calculatePoints = (simulation: Simulation): SimulationResult => {
  switch (simulation.visaType) {
    case VisaType.B:
      return calculate(
        Object.values(matchersForVisaB),
        simulation.qualifications,
      )
    case VisaType.C:
      return calculate(
        Object.values(matchersForVisaC),
        simulation.qualifications,
      )
    default:
      throw new Error('not yet implemented')
  }
}

const calculate = (
  matchers: CriteriaMatcher[],
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
