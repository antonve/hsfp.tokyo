// A qualification is something the user has or is.
// These can later be used to match against Criteria to get points.

import { z } from 'zod'

// There are variations with more specific values limited to that type of qualification.
export interface Qualification {
  category: Category
  id: string
}

export interface QualificationWithValue extends Qualification {
  value: number
}

// TODO: we need to rename the bonus points
// Qualifications are linked to a Category and a whole category should be scored together.
// Each visa type has slight variations of what categories are available.
// Forms are also generated based on these types.
export const CategorySchema = z.enum([
  'academic-background',
  'career',
  'age',
  'compensation',
  'research-achievements',
  'position',
  'licenses',
  'bonus',
  'contracting-organization',
  'japanese',
  'university',
  'investor',
])

export type Category = z.infer<typeof CategorySchema>

// Qualification generator functions

export function academicBackgroundWith({
  degree,
}: {
  degree: string
}): Qualification {
  return {
    category: 'academic-background',
    id: degree,
  }
}

export function professionalCareerWith({
  yearsOfExperience,
}: {
  yearsOfExperience: number
}): QualificationWithValue {
  return {
    category: 'career',
    id: 'experience',
    value: yearsOfExperience,
  }
}

export function annualSalaryOf(salary: number): QualificationWithValue {
  return {
    category: 'compensation',
    id: 'salary',
    value: salary,
  }
}

export function ageOf(age: number): QualificationWithValue {
  return {
    category: 'age',
    id: 'age',
    value: age,
  }
}

export function researchAchievementOf({
  kind,
}: {
  kind: string
}): Qualification {
  return {
    category: 'research-achievements',
    id: kind,
  }
}

export function licenseHolder({
  count,
}: {
  count: number
}): QualificationWithValue {
  return {
    category: 'licenses',
    id: 'licenses',
    value: count,
  }
}

export function specialOf({ kind: id }: { kind: string }): Qualification {
  return {
    category: 'bonus',
    id,
  }
}

export function contractingOrganizationOf({
  kind: id,
}: {
  kind: string
}): Qualification {
  return {
    category: 'contracting-organization',
    id,
  }
}

export function japanese({ kind: id }: { kind: string }): Qualification {
  return {
    category: 'japanese',
    id,
  }
}

export function universityOf({ kind: id }: { kind: string }): Qualification {
  return {
    category: 'university',
    id,
  }
}

export function positionInCompany({ kind }: { kind: string }): Qualification {
  return {
    category: 'position',
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
