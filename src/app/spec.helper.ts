import {
  Simulation,
  Qualification,
  AgeQualification,
  AnnualSalaryQualification,
  ProfessionalCareerQualification,
  LicensesQualification,
  VisaType,
} from '@app/domain'

export function simulationWithCriteria(
  qualifications: Qualification[],
): Simulation {
  return {
    visaType: VisaType.B,
    qualifications,
  }
}

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
}): ProfessionalCareerQualification {
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
