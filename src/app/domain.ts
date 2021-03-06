import { matchersForVisaB } from './visa/b'

export interface Simulation {
  visaType: VisaType
  qualifications: Qualification[]
}

export enum VisaType {
  A = 'A',
  B = 'B',
  C = 'C',
}

export interface Criteria {
  id: string
  points: number
  match?: (value: any) => boolean
}

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

export interface Qualification {
  category: Category
  id: string
}

export interface CareerQualification extends Qualification {
  category: 'CAREER'
  id: 'experience'
  yearsOfExperience: number
}

export interface AnnualSalaryQualification extends Qualification {
  category: 'ANNUAL_SALARY'
  id: 'salary'
  salary: number
}

export interface AgeQualification extends Qualification {
  category: 'AGE'
  id: 'age'
  age: number
}

export interface LicensesQualification extends Qualification {
  category: 'LICENSES'
  id: 'licenses'
  count: number
}

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
  | 'SPECIAL_INVESTOR'

export const calculatePoints = (simulation: Simulation): SimulationResult => {
  switch (simulation.visaType) {
    case VisaType.B:
      return calculate(
        Object.values(matchersForVisaB),
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

export const matchAny = (
  criteria: Criteria[],
  qualifications: Qualification[],
): SimulationResult => {
  const matches = criteria.filter(
    c => qualifications.find(q => q.id == c.id) != undefined,
  )

  let points = 0
  if (matches.length > 0) {
    points = criteria[0].points
  }

  return { matches, points }
}

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
