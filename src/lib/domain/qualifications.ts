// A qualification is something the user has or is.
// These can later be used to match against Criteria to get points.
// There are variations with more specific values limited to that type of qualification.
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

// Qualification generator functions

export function academicBackgroundWith({
  degree,
}: {
  degree: string
}): Qualification {
  return {
    category: 'ACADEMIC_BACKGROUND',
    id: degree,
  }
}

export function professionalCareerWith({
  yearsOfExperience,
}: {
  yearsOfExperience: number
}): CareerQualification {
  return {
    category: 'CAREER',
    id: 'experience',
    yearsOfExperience,
  }
}

export function annualSalaryOf(salary: number): AnnualSalaryQualification {
  return {
    category: 'ANNUAL_SALARY',
    id: 'salary',
    salary,
  }
}

export function ageOf(age: number): AgeQualification {
  return {
    category: 'AGE',
    id: 'age',
    age,
  }
}

export function researchAchievementOf({
  kind,
}: {
  kind: string
}): Qualification {
  return {
    category: 'RESEARCH_ACHIEVEMENTS',
    id: kind,
  }
}

export function licenseHolder({
  count,
}: {
  count: number
}): LicensesQualification {
  return {
    category: 'LICENSES',
    id: 'licenses',
    count,
  }
}

export function specialOf({ kind: id }: { kind: string }): Qualification {
  return {
    category: 'SPECIAL',
    id,
  }
}

export function contractingOrganizationOf({
  kind: id,
}: {
  kind: string
}): Qualification {
  return {
    category: 'SPECIAL_CONTRACTING_ORGANIZATION',
    id,
  }
}

export function japanese({ kind: id }: { kind: string }): Qualification {
  return {
    category: 'SPECIAL_JAPANESE',
    id,
  }
}

export function universityOf({ kind: id }: { kind: string }): Qualification {
  return {
    category: 'SPECIAL_UNIVERSITY',
    id,
  }
}

export function positionInCompany({ kind }: { kind: string }): Qualification {
  return {
    category: 'POSITION',
    id: kind,
  }
}

// Helper functions to work with qualifications

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
