import { Category } from '@lib/domain'

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
