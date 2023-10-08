import { Qualification } from './domain/qualifications'
import { matchersForVisaB } from './visa/b'
import { matchersForVisaC } from './visa/c'

export interface Simulation {
  visaType: VisaType
  qualifications: Qualification[]
}

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

export interface SimulationResult {
  matches: Criteria[]
  points: number
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

export const errorMessages = {
  salaryTooLow: 'salary must be above 3m to be eligible for the HSFP visa',
}

export const mapById = (objects: { id: string }[]) => {
  return objects.reduce((accumulator, current) => {
    accumulator[current.id] = current
    return accumulator
  }, {} as { [key: string]: any })
}

// TODO: this can be replaced with matchQualificationWithMostPoints
export const matchAny = (
  criteria: Criteria[],
  qualifications: Qualification[],
): SimulationResult => {
  const matches = criteria.filter(
    c => qualifications.find(q => q.id == c.id) != undefined,
  )

  let points = 0
  // TODO: Is this logic sound?
  if (matches.length > 0) {
    points = criteria[0].points
  }

  return { matches, points }
}

// TODO: rename to matchQualificationWithMostPoints
export const matchMaxPoints = (
  allCriteria: Criteria[],
  value: any,
): SimulationResult => {
  let result: SimulationResult = { matches: [], points: 0 }

  allCriteria.forEach(criteria => {
    if (criteria.match?.(value) ?? false) {
      if (result.points < criteria.points) {
        result.points = criteria.points
        result.matches = [criteria]
      }
    }
  })

  return result
}

export const containsQualificationWithId = (
  qualifications: Qualification[],
  id: string,
): boolean => qualifications.find(q => q.id === id) !== undefined

export const containsMatchingQualification = (
  qualifications: Qualification[],
  match: (qualification: Qualification) => boolean,
): boolean => qualifications.find(q => match(q)) !== undefined

export const removeQualificationWithId = (
  qualifications: Qualification[],
  id: string,
): Qualification[] => qualifications.filter(q => q.id !== id)

export const getQualification = (
  qualifications: Qualification[],
  category: string,
  id: string,
): Qualification | undefined =>
  qualifications.find(q => q.category === category && q.id === id)

// TODO: rename to matchAllQualifications
export const filterUniqueQualifications = (
  criteria: Criteria[],
  allQualifications: Qualification[],
  category: String,
) => {
  const qualifications = allQualifications
    .filter(q => q.category === category)
    .map(q => q.id)
  const matches = criteria.filter(c => qualifications.includes(c.id))
  const points = matches.reduce(
    (accumulator, current) => accumulator + current.points,
    0,
  )
  return { matches, points }
}
