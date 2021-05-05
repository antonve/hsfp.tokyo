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
      const matchingCriteria = criteria.filter(
        c => c.category === group.category,
      )
      return group.totalPoints(group.definitions, matchingCriteria)
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
      const matches = definitions.filter(d =>
        criteria.map(c => c.id).includes(d.id),
      )
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
      { id: '10_years_or_more', points: 20 },
      { id: '7_years_or_more', points: 15 },
      { id: '5_years_or_more', points: 10 },
      { id: '3_years_or_more', points: 5 },
    ],
    totalPoints: definitions => 0,
  },
  {
    category: CriteriaCategory.AnnualSalary,
    definitions: [
      { id: '10m_or_more', points: 40 },
      { id: '9m_or_more', points: 35 },
      { id: '8m_or_more', points: 30 },
      { id: '7m_or_more', points: 25 },
      { id: '6m_or_more', points: 20 },
      { id: '5m_or_more', points: 15 },
      { id: '4m_or_more', points: 10 },
    ],
    totalPoints: definitions => 0,
  },
  {
    category: CriteriaCategory.Age,
    definitions: [
      { id: 'less_than_30', points: 15 },
      { id: 'less_than_35', points: 10 },
      { id: 'less_than_40', points: 5 },
    ],
    totalPoints: definitions => 0,
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
