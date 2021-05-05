export interface Checklist {
  visaType: VisaType
  matchingCriteria: Criteria[]
}

export const calculatePoints = (checklist: Checklist): number => {
  switch (checklist.visaType) {
    case VisaType.B:
      return calculate(criteriaForVisaB, checklist.matchingCriteria)
    default:
      throw new Error('not yet implemented')
  }
}

const calculate = (
  definitionGroups: CriteriaDefinitionGroup[],
  criteria: Criteria[],
): number => {
  return definitionGroups
    .map(group => {
      return group.totalPoints(group.definitions, criteria)
    })
    .reduce((accumulator, current) => accumulator + current, 0)
}

export enum VisaType {
  A = 'A',
  B = 'B',
  C = 'C',
}

export interface Criteria {
  category: CriteriaCategory
  id: string
}

export interface CriteriaProfessionalCareer extends Criteria {
  category: CriteriaCategory.ProfessionalCareer
  id: 'experience'
  yearsOfExperience: number
}

export interface CriteriaAnnualSalary extends Criteria {
  category: CriteriaCategory.AnnualSalary
  id: 'salary'
  salary: number
}

export interface CriteriaAge extends Criteria {
  category: CriteriaCategory.Age
  id: 'age'
  age: number
}

interface CriteriaDefinition {
  id: string
  points: number
  match?: (value: any) => boolean
}

export enum CriteriaCategory {
  AcademicBackground = 'ACADEMIC_BACKGROUND',
  ProfessionalCareer = 'PROFESSIONAL_CAREER',
  Age = 'AGE',
  AnnualSalary = 'ANNUAL_SALARY',
  ResearchAchievements = 'RESEARCH_ACHIEVEMENTS',
  Licenses = 'LICENSES',
  Special = 'SPECIAL',
  SpecialContractingOrganization = 'SPECIAL_CONTRACTING_ORGANIZATION',
  SpecialJapanese = 'SPECIAL_JAPANESE',
  SpecialUniversity = 'SPECIAL_UNIVERSITY',
  Position = 'POSITION',
}

interface CriteriaDefinitionGroup {
  category: CriteriaCategory
  definitions: CriteriaDefinition[]
  totalPoints: (
    defintions: CriteriaDefinition[],
    criteria: Criteria[],
  ) => number
}

export const errorMessages = {
  salaryTooLow: 'salary must be above 3m to be eligible for the HSFP visa',
}

const criteriaForVisaB: CriteriaDefinitionGroup[] = [
  {
    category: CriteriaCategory.AcademicBackground,
    definitions: [
      { id: 'doctor', points: 30 },
      { id: 'business_management', points: 25 },
      { id: 'master', points: 20 },
      { id: 'bachelor', points: 10 },
      { id: 'dual_degree', points: 5 },
    ],
    totalPoints: (definitions, criteria) => {
      const criteriaIds = criteria
        .filter(c => c.category === CriteriaCategory.AcademicBackground)
        .map(c => c.id)
      const matches = definitions.filter(d => criteriaIds.includes(d.id))
      const points = matches
        .filter(d => d.id != 'dual_degree')
        .reduce((accumulator, current) => {
          if (current.points > accumulator) {
            return current.points
          }
          return accumulator
        }, 0)

      // A dual degree gives a bonus
      const bonus = matches.find(d => d.id === 'dual_degree')?.points ?? 0

      return points + bonus
    },
  },
  {
    category: CriteriaCategory.ProfessionalCareer,
    definitions: [
      { id: '10_years_or_more', points: 20, match: exp => exp >= 10 },
      { id: '7_years_or_more', points: 15, match: exp => exp >= 7 },
      { id: '5_years_or_more', points: 10, match: exp => exp >= 5 },
      { id: '3_years_or_more', points: 5, match: exp => exp >= 3 },
    ],
    totalPoints: (definitions, criteria) => {
      const match = criteria.find(
        c => c.category === CriteriaCategory.ProfessionalCareer,
      ) as CriteriaProfessionalCareer | undefined
      const yearsOfExperience = match?.yearsOfExperience ?? 0
      const points = maxMatchingPoints(definitions, yearsOfExperience)

      return points
    },
  },
  {
    category: CriteriaCategory.AnnualSalary,
    definitions: [
      { id: '10m_or_more', points: 40, match: salary => salary >= 10_000_000 },
      { id: '9m_or_more', points: 35, match: salary => salary >= 9_000_000 },
      { id: '8m_or_more', points: 30, match: salary => salary >= 8_000_000 },
      { id: '7m_or_more', points: 25, match: salary => salary >= 7_000_000 },
      { id: '6m_or_more', points: 20, match: salary => salary >= 6_000_000 },
      { id: '5m_or_more', points: 15, match: salary => salary >= 5_000_000 },
      { id: '4m_or_more', points: 10, match: salary => salary >= 4_000_000 },
    ],
    totalPoints: (definitions, criteria) => {
      const match = criteria.find(
        c => c.category === CriteriaCategory.AnnualSalary,
      ) as CriteriaAnnualSalary | undefined

      if (match === undefined) {
        return 0
      }

      const salary = match.salary
      if (salary < 3_000_000) {
        throw new Error(errorMessages.salaryTooLow)
      }

      const points = maxMatchingPoints(definitions, salary)

      return points
    },
  },
  {
    category: CriteriaCategory.Age,
    definitions: [
      { id: 'less_than_30', points: 15, match: age => age < 30 },
      { id: 'less_than_35', points: 10, match: age => age < 35 },
      { id: 'less_than_40', points: 5, match: age => age < 40 },
    ],
    totalPoints: (definitions, criteria) => {
      const match = criteria.find(c => c.category === CriteriaCategory.Age) as
        | CriteriaAge
        | undefined

      if (match === undefined) {
        return 0
      }

      const age = match.age
      const points = maxMatchingPoints(definitions, age)

      return points
    },
  },
  {
    category: CriteriaCategory.ResearchAchievements,
    definitions: [
      { id: 'patent_inventor', points: 15 },
      { id: 'conducted_financed_projects', points: 15 },
      { id: 'has_published_three_papers', points: 15 },
      { id: 'research_recognized_by_japan', points: 15 },
    ],
    totalPoints: definitions => 0,
  },
  {
    category: CriteriaCategory.Licenses,
    definitions: [
      { id: 'has_one_national_license', points: 5 },
      { id: 'has_two_or_more_national_license', points: 5 },
    ],
    totalPoints: definitions => 0,
  },
  {
    category: CriteriaCategory.Special,
    definitions: [
      { id: 'rnd_exceeds_three_percent', points: 5 },
      { id: 'foreign_work_related_qualification', points: 5 },
      { id: 'advanced_project_growth_field', points: 10 },
      {
        id: 'completed_training_conducted_by_jica_innovative_asia_project',
        points: 5,
      },
    ],
    totalPoints: definitions => 0,
  },
  {
    category: CriteriaCategory.SpecialContractingOrganization,
    definitions: [
      { id: 'contracting_organization_promotes_innovation', points: 10 },
      { id: 'contracting_organization_small_medium_sized', points: 10 },
      { id: 'contracting_organization_promotes_highly_skilled', points: 10 },
    ],
    totalPoints: definitions => 0,
  },
  {
    category: CriteriaCategory.SpecialJapanese,
    definitions: [
      { id: 'graduated_japanese_uni_or_course', points: 10 },
      { id: 'jlpt_n1_or_equivalent', points: 15 },
      { id: 'jlpt_n2_or_equivalent', points: 10 },
    ],
    totalPoints: definitions => 0,
  },
  {
    category: CriteriaCategory.SpecialUniversity,
    definitions: [
      { id: 'top_ranked_university_graduate', points: 10 },
      {
        id: 'university_funded_by_top_global_universities_project_graduate',
        points: 10,
      },
      {
        id:
          'university_designated_innovative_asia_project_partner_school_graduate',
        points: 10,
      },
    ],
    totalPoints: definitions => 0,
  },
]

const groupById = (objects: { id: string }[]) => {
  return objects.reduce(
    (accumulator, current) => (accumulator[current.id] = current),
    {} as { [key: string]: any },
  )
}

const maxMatchingPoints = (
  definitions: CriteriaDefinition[],
  value: any,
): number => {
  const points = definitions.reduce((total, definition) => {
    if (definition.match?.(value) ?? false) {
      return Math.max(total, definition.points)
    }

    return total
  }, 0)

  return points
}
