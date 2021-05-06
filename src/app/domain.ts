export interface Checklist {
  visaType: VisaType
  matchingCriteria: Criteria[]
}

export const calculatePoints = (checklist: Checklist): number => {
  switch (checklist.visaType) {
    case VisaType.B:
      return calculate(
        Object.values(criteriaForVisaB),
        checklist.matchingCriteria,
      )
    default:
      throw new Error('not yet implemented')
  }
}

const calculate = (
  definitionGroups: CriteriaDefinitionGroup[],
  criteria: Criteria[],
): number => {
  return definitionGroups
    .flatMap(group => {
      let result = group.matchingDefinitions(group.definitions, criteria)
      return result.points
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

export interface CriteriaLicenses extends Criteria {
  category: CriteriaCategory.Licenses
  id: 'licenses'
  count: number
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
  definitions: CriteriaDefinition[]
  matchingDefinitions: (
    defintions: CriteriaDefinition[],
    criteria: Criteria[],
  ) => MatchingDefinitionsResult
}

interface MatchingDefinitionsResult {
  matches: CriteriaDefinition[]
  points: number
}

export const errorMessages = {
  salaryTooLow: 'salary must be above 3m to be eligible for the HSFP visa',
}

const criteriaForVisaB: {
  [key in CriteriaCategory]: CriteriaDefinitionGroup
} = {
  [CriteriaCategory.AcademicBackground]: {
    definitions: [
      { id: 'doctor', points: 30 },
      { id: 'business_management', points: 25 },
      { id: 'master', points: 20 },
      { id: 'bachelor', points: 10 },
      { id: 'dual_degree', points: 5 },
    ],
    matchingDefinitions: (definitions, allCriteria) => {
      const criteria = allCriteria
        .filter(c => c.category === CriteriaCategory.AcademicBackground)
        .map(c => c.id)

      const degrees = definitions.filter(d => criteria.includes(d.id))
      const bonus = degrees.find(d => d.id === 'dual_degree')
      const [highestDegree] = degrees
        .filter(d => d.id != 'dual_degree')
        .sort((a, b) => b.points - a.points)

      let points = 0
      let matches: CriteriaDefinition[] = []

      if (highestDegree) {
        points += highestDegree.points
        matches.push(highestDegree)
      }

      if (bonus) {
        points += bonus.points
        matches.push(bonus)
      }

      return { matches, points }
    },
  },
  [CriteriaCategory.ProfessionalCareer]: {
    definitions: [
      { id: '10_years_or_more', points: 20, match: exp => exp >= 10 },
      { id: '7_years_or_more', points: 15, match: exp => exp >= 7 },
      { id: '5_years_or_more', points: 10, match: exp => exp >= 5 },
      { id: '3_years_or_more', points: 5, match: exp => exp >= 3 },
    ],
    matchingDefinitions: (definitions, criteria) => {
      const match = criteria.find(
        c => c.category === CriteriaCategory.ProfessionalCareer,
      ) as CriteriaProfessionalCareer | undefined
      const yearsOfExperience = match?.yearsOfExperience ?? 0

      return matchMaxPoints(definitions, yearsOfExperience)
    },
  },
  [CriteriaCategory.AnnualSalary]: {
    definitions: [
      {
        id: '10m_or_more',
        points: 40,
        match: ({ salary }) => salary >= 10_000_000,
      },
      {
        id: '9m_or_more',
        points: 35,
        match: ({ salary }) => salary >= 9_000_000,
      },
      {
        id: '8m_or_more',
        points: 30,
        match: ({ salary }) => salary >= 8_000_000,
      },
      {
        id: '7m_or_more',
        points: 25,
        match: ({ salary, age }) => salary >= 7_000_000 && age < 40,
      },
      {
        id: '6m_or_more',
        points: 20,
        match: ({ salary, age }) => salary >= 6_000_000 && age < 40,
      },
      {
        id: '5m_or_more',
        points: 15,
        match: ({ salary, age }) => salary >= 5_000_000 && age < 35,
      },
      {
        id: '4m_or_more',
        points: 10,
        match: ({ salary, age }) => salary >= 4_000_000 && age < 30,
      },
    ],
    matchingDefinitions: (definitions, criteria) => {
      const matchSalary = criteria.find(
        c => c.category === CriteriaCategory.AnnualSalary,
      ) as CriteriaAnnualSalary | undefined
      const matchAge = criteria.find(
        c => c.category === CriteriaCategory.Age,
      ) as CriteriaAge | undefined

      if (matchSalary === undefined || matchAge == undefined) {
        return { matches: [], points: 0 }
      }

      const age = matchAge.age
      const salary = matchSalary.salary
      if (salary < 3_000_000) {
        throw new Error(errorMessages.salaryTooLow)
      }

      return matchMaxPoints(definitions, { salary, age })
    },
  },
  [CriteriaCategory.Age]: {
    definitions: [
      { id: 'less_than_30', points: 15, match: age => age < 30 },
      { id: 'less_than_35', points: 10, match: age => age < 35 },
      { id: 'less_than_40', points: 5, match: age => age < 40 },
    ],
    matchingDefinitions: (definitions, criteria) => {
      const match = criteria.find(c => c.category === CriteriaCategory.Age) as
        | CriteriaAge
        | undefined

      if (match === undefined) {
        return { matches: [], points: 0 }
      }

      const age = match.age
      return matchMaxPoints(definitions, age)
    },
  },
  [CriteriaCategory.ResearchAchievements]: {
    definitions: [
      { id: 'patent_inventor', points: 15 },
      { id: 'conducted_financed_projects', points: 15 },
      { id: 'has_published_three_papers', points: 15 },
      { id: 'research_recognized_by_japan', points: 15 },
    ],
    matchingDefinitions: (definitions, allCriteria) => {
      const criteria = allCriteria.filter(
        c => c.category === CriteriaCategory.ResearchAchievements,
      )
      return matchAny(definitions, criteria)
    },
  },
  [CriteriaCategory.Licenses]: {
    definitions: [
      {
        id: 'has_one_national_license',
        points: 5,
        match: count => count >= 1,
      },
      {
        id: 'has_two_or_more_national_license',
        points: 10,
        match: count => count >= 2,
      },
    ],
    matchingDefinitions: (definitions, criteria) => {
      const match = criteria.find(
        c => c.category === CriteriaCategory.Licenses,
      ) as CriteriaLicenses | undefined

      if (match === undefined) {
        return { matches: [], points: 0 }
      }

      const count = match.count
      return matchMaxPoints(definitions, count)
    },
  },
  [CriteriaCategory.Special]: {
    definitions: [
      { id: 'rnd_exceeds_three_percent', points: 5 },
      { id: 'foreign_work_related_qualification', points: 5 },
      { id: 'advanced_project_growth_field', points: 10 },
      {
        id: 'completed_training_conducted_by_jica_innovative_asia_project',
        points: 5,
      },
    ],
    matchingDefinitions: (definitions, allCriteria) => {
      const criteria = allCriteria
        .filter(c => c.category === CriteriaCategory.Special)
        .map(c => c.id)

      const matches = definitions.filter(d => criteria.includes(d.id))
      const points = matches.reduce(
        (accumulator, current) => accumulator + current.points,
        0,
      )
      return { matches: [], points }
    },
  },
  [CriteriaCategory.SpecialContractingOrganization]: {
    definitions: [
      { id: 'contracting_organization_promotes_innovation', points: 10 },
      { id: 'contracting_organization_small_medium_sized', points: 10 },
      { id: 'contracting_organization_promotes_highly_skilled', points: 10 },
    ],
    matchingDefinitions: (definitions, allCriteria) => {
      let points = 0
      let matches: CriteriaDefinition[] = []

      const defs = mapById(definitions)
      const criteria = allCriteria
        .filter(
          c => c.category === CriteriaCategory.SpecialContractingOrganization,
        )
        .map(c => c.id)
      const isInnovative = criteria.includes(
        'contracting_organization_promotes_innovation',
      )
      const isSmallCompany = criteria.includes(
        'contracting_organization_small_medium_sized',
      )
      const isPromotingHighlySkilled = criteria.includes(
        'contracting_organization_promotes_highly_skilled',
      )

      if (isInnovative) {
        matches.push(defs['contracting_organization_promotes_innovation'])
        points += defs['contracting_organization_promotes_innovation'].points
      }
      if (isInnovative && isSmallCompany) {
        matches.push(defs['contracting_organization_small_medium_sized'])
        points += defs['contracting_organization_small_medium_sized'].points
      }
      if (isPromotingHighlySkilled) {
        matches.push(defs['contracting_organization_promotes_highly_skilled'])
        points +=
          defs['contracting_organization_promotes_highly_skilled'].points
      }

      return { matches, points }
    },
  },
  [CriteriaCategory.SpecialJapanese]: {
    definitions: [
      { id: 'graduated_japanese_uni_or_course', points: 10 },
      { id: 'jlpt_n1_or_equivalent', points: 15 },
      { id: 'jlpt_n2_or_equivalent', points: 10 },
    ],
    matchingDefinitions: (definitions, allCriteria) => {
      let points = 0
      let matches: CriteriaDefinition[] = []

      const defs = mapById(definitions)
      const criteria = allCriteria
        .filter(c => c.category === CriteriaCategory.SpecialJapanese)
        .map(c => c.id)
      const isUniGraduate = criteria.includes(
        'graduated_japanese_uni_or_course',
      )
      const hasN1 = criteria.includes('jlpt_n1_or_equivalent')
      const hasN2 = criteria.includes('jlpt_n2_or_equivalent')

      if (hasN2 && !hasN1 && !isUniGraduate) {
        matches.push(defs['jlpt_n2_or_equivalent'])
        points += defs['jlpt_n2_or_equivalent'].points
      }
      if (hasN1) {
        matches.push(defs['jlpt_n1_or_equivalent'])
        points += defs['jlpt_n1_or_equivalent'].points
      }
      if (isUniGraduate) {
        matches.push(defs['graduated_japanese_uni_or_course'])
        points += defs['graduated_japanese_uni_or_course'].points
      }

      return { matches, points }
    },
  },
  [CriteriaCategory.SpecialUniversity]: {
    definitions: [
      { id: 'top_ranked_university_graduate', points: 10 },
      {
        id: 'graduate_of_university_funded_by_top_global_universities_project',
        points: 10,
      },
      {
        id: 'graduate_of_university_partner_school',
        points: 10,
      },
    ],
    matchingDefinitions: (definitions, allCriteria) => {
      const criteria = allCriteria.filter(
        c => c.category === CriteriaCategory.SpecialUniversity,
      )

      return matchAny(definitions, criteria)
    },
  },
  // This is ignored for visa B
  [CriteriaCategory.Position]: {
    definitions: [],
    matchingDefinitions: () => ({ matches: [], points: 0 }),
  },
}

const mapById = (objects: { id: string }[]) => {
  return objects.reduce((accumulator, current) => {
    accumulator[current.id] = current
    return accumulator
  }, {} as { [key: string]: any })
}

const matchAny = (
  definitions: CriteriaDefinition[],
  criteria: Criteria[],
): MatchingDefinitionsResult => {
  const matches = definitions.filter(
    d => criteria.find(c => c.id == d.id) != undefined,
  )

  let points = 0
  if (matches.length > 0) {
    points = definitions[0].points
  }

  return { matches, points }
}

// TODO: Rename to matchMaxPoints
const matchMaxPoints = (
  definitions: CriteriaDefinition[],
  value: any,
): MatchingDefinitionsResult => {
  let result: MatchingDefinitionsResult = { matches: [], points: 0 }

  definitions.forEach(definition => {
    if (definition.match?.(value) ?? false) {
      if (result.points < definition.points) {
        result.points = definition.points
        result.matches = [definition]
      }
    }
  })

  return result
}
