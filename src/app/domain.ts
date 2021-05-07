export interface Simulation {
  visaType: VisaType
  qualifications: Qualification[]
}

export const calculatePoints = (
  simulation: Simulation,
): SimulationResult => {
  switch (simulation.visaType) {
    case VisaType.B:
      return calculate(
        Object.values(criteriaForVisaB),
        simulation.qualifications,
      )
    default:
      throw new Error('not yet implemented')
  }
}

const calculate = (
  definitionGroups: CriteriaDefinitionGroup[],
  qualifications: Qualification[],
): SimulationResult => {
  return definitionGroups
    .map(group => group.matchingDefinitions(group.criteria, qualifications))
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

export enum VisaType {
  A = 'A',
  B = 'B',
  C = 'C',
}

export interface Qualification {
  category: CriteriaCategory
  id: string
}

export interface CriteriaProfessionalCareer extends Qualification {
  category: 'PROFESSIONAL_CAREER'
  id: 'experience'
  yearsOfExperience: number
}

export interface CriteriaAnnualSalary extends Qualification {
  category: 'ANNUAL_SALARY'
  id: 'salary'
  salary: number
}

export interface CriteriaAge extends Qualification {
  category: 'AGE'
  id: 'age'
  age: number
}

export interface CriteriaLicenses extends Qualification {
  category: 'LICENSES'
  id: 'licenses'
  count: number
}

interface Criteria {
  id: string
  points: number
  match?: (value: any) => boolean
}

export type CriteriaCategory =
  | CriteriaCategoryVisaA
  | CriteriaCategoryVisaB
  | CriteriaCategoryVisaC

type CriteriaCategoryVisaA =
  | 'ACADEMIC_BACKGROUND'
  | 'PROFESSIONAL_CAREER'
  | 'AGE'
  | 'ANNUAL_SALARY'
  | 'RESEARCH_ACHIEVEMENTS'
  | 'SPECIAL'
  | 'SPECIAL_CONTRACTING_ORGANIZATION'
  | 'SPECIAL_JAPANESE'
  | 'SPECIAL_UNIVERSITY'

type CriteriaCategoryVisaB =
  | 'ACADEMIC_BACKGROUND'
  | 'PROFESSIONAL_CAREER'
  | 'AGE'
  | 'ANNUAL_SALARY'
  | 'RESEARCH_ACHIEVEMENTS'
  | 'LICENSES'
  | 'SPECIAL'
  | 'SPECIAL_CONTRACTING_ORGANIZATION'
  | 'SPECIAL_JAPANESE'
  | 'SPECIAL_UNIVERSITY'

type CriteriaCategoryVisaC =
  | 'ACADEMIC_BACKGROUND'
  | 'PROFESSIONAL_CAREER'
  | 'ANNUAL_SALARY'
  | 'POSITION'
  | 'SPECIAL'
  | 'SPECIAL_CONTRACTING_ORGANIZATION'
  | 'SPECIAL_JAPANESE'
  | 'SPECIAL_UNIVERSITY'
  | 'SPECIAL_INVESTOR'

interface CriteriaDefinitionGroup {
  criteria: Criteria[]
  matchingDefinitions: (
    defintions: Criteria[],
    qualifications: Qualification[],
  ) => SimulationResult
}

interface SimulationResult {
  matches: Criteria[]
  points: number
}

export const errorMessages = {
  salaryTooLow: 'salary must be above 3m to be eligible for the HSFP visa',
}

const criteriaForVisaB: {
  [key in CriteriaCategoryVisaB]: CriteriaDefinitionGroup
} = {
  ACADEMIC_BACKGROUND: {
    criteria: [
      { id: 'doctor', points: 30 },
      { id: 'business_management', points: 25 },
      { id: 'master', points: 20 },
      { id: 'bachelor', points: 10 },
      { id: 'dual_degree', points: 5 },
    ],
    matchingDefinitions: (definitions, allQualifications) => {
      const qualifications = allQualifications
        .filter(q => q.category === 'ACADEMIC_BACKGROUND')
        .map(q => q.id)

      const degrees = definitions.filter(d => qualifications.includes(d.id))
      const bonus = degrees.find(d => d.id === 'dual_degree')
      const [highestDegree] = degrees
        .filter(d => d.id != 'dual_degree')
        .sort((a, b) => b.points - a.points)

      let points = 0
      let matches: Criteria[] = []

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
  PROFESSIONAL_CAREER: {
    criteria: [
      { id: '10_years_or_more', points: 20, match: exp => exp >= 10 },
      { id: '7_years_or_more', points: 15, match: exp => exp >= 7 },
      { id: '5_years_or_more', points: 10, match: exp => exp >= 5 },
      { id: '3_years_or_more', points: 5, match: exp => exp >= 3 },
    ],
    matchingDefinitions: (definitions, qualifications) => {
      const match = qualifications.find(q => q.category === 'PROFESSIONAL_CAREER') as
        | CriteriaProfessionalCareer
        | undefined
      const yearsOfExperience = match?.yearsOfExperience ?? 0

      return matchMaxPoints(definitions, yearsOfExperience)
    },
  },
  ANNUAL_SALARY: {
    criteria: [
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
    matchingDefinitions: (definitions, qualifications) => {
      const matchSalary = qualifications.find(q => q.category === 'ANNUAL_SALARY') as
        | CriteriaAnnualSalary
        | undefined
      const matchAge = qualifications.find(q => q.category === 'AGE') as
        | CriteriaAge
        | undefined

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
  AGE: {
    criteria: [
      { id: 'less_than_30', points: 15, match: age => age < 30 },
      { id: 'less_than_35', points: 10, match: age => age < 35 },
      { id: 'less_than_40', points: 5, match: age => age < 40 },
    ],
    matchingDefinitions: (definitions, qualifications) => {
      const match = qualifications.find(q => q.category === 'AGE') as
        | CriteriaAge
        | undefined

      if (match === undefined) {
        return { matches: [], points: 0 }
      }

      const age = match.age
      return matchMaxPoints(definitions, age)
    },
  },
  RESEARCH_ACHIEVEMENTS: {
    criteria: [
      { id: 'patent_inventor', points: 15 },
      { id: 'conducted_financed_projects', points: 15 },
      { id: 'has_published_three_papers', points: 15 },
      { id: 'research_recognized_by_japan', points: 15 },
    ],
    matchingDefinitions: (definitions, allQualifications) => {
      const qualifications = allQualifications.filter(
        q => q.category === 'RESEARCH_ACHIEVEMENTS',
      )
      return matchAny(definitions, qualifications)
    },
  },
  LICENSES: {
    criteria: [
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
    matchingDefinitions: (definitions, qualifications) => {
      const match = qualifications.find(q => q.category === 'LICENSES') as
        | CriteriaLicenses
        | undefined

      if (match === undefined) {
        return { matches: [], points: 0 }
      }

      const count = match.count
      return matchMaxPoints(definitions, count)
    },
  },
  SPECIAL: {
    criteria: [
      { id: 'rnd_exceeds_three_percent', points: 5 },
      { id: 'foreign_work_related_qualification', points: 5 },
      { id: 'advanced_project_growth_field', points: 10 },
      {
        id: 'completed_training_conducted_by_jica_innovative_asia_project',
        points: 5,
      },
    ],
    matchingDefinitions: (definitions, allQualifications) => {
      const qualifications = allQualifications
        .filter(q => q.category === 'SPECIAL')
        .map(q => q.id)

      const matches = definitions.filter(d => qualifications.includes(d.id))
      const points = matches.reduce(
        (accumulator, current) => accumulator + current.points,
        0,
      )
      return { matches, points }
    },
  },
  SPECIAL_CONTRACTING_ORGANIZATION: {
    criteria: [
      { id: 'contracting_organization_promotes_innovation', points: 10 },
      { id: 'contracting_organization_small_medium_sized', points: 10 },
      { id: 'contracting_organization_promotes_highly_skilled', points: 10 },
    ],
    matchingDefinitions: (definitions, allQualifications) => {
      let points = 0
      let matches: Criteria[] = []

      const defs = mapById(definitions)
      const qualifications = allQualifications
        .filter(q => q.category === 'SPECIAL_CONTRACTING_ORGANIZATION')
        .map(q => q.id)
      const isInnovative = qualifications.includes(
        'contracting_organization_promotes_innovation',
      )
      const isSmallCompany = qualifications.includes(
        'contracting_organization_small_medium_sized',
      )
      const isPromotingHighlySkilled = qualifications.includes(
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
  SPECIAL_JAPANESE: {
    criteria: [
      { id: 'graduated_japanese_uni_or_course', points: 10 },
      { id: 'jlpt_n1_or_equivalent', points: 15 },
      { id: 'jlpt_n2_or_equivalent', points: 10 },
    ],
    matchingDefinitions: (definitions, allQualifications) => {
      let points = 0
      let matches: Criteria[] = []

      const defs = mapById(definitions)
      const qualifications = allQualifications
        .filter(q => q.category === 'SPECIAL_JAPANESE')
        .map(q => q.id)
      const isUniGraduate = qualifications.includes(
        'graduated_japanese_uni_or_course',
      )
      const hasN1 = qualifications.includes('jlpt_n1_or_equivalent')
      const hasN2 = qualifications.includes('jlpt_n2_or_equivalent')

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
  SPECIAL_UNIVERSITY: {
    criteria: [
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
    matchingDefinitions: (definitions, allQualifications) => {
      const qualifications = allQualifications.filter(
        q => q.category === 'SPECIAL_UNIVERSITY',
      )

      return matchAny(definitions, qualifications)
    },
  },
}

const mapById = (objects: { id: string }[]) => {
  return objects.reduce((accumulator, current) => {
    accumulator[current.id] = current
    return accumulator
  }, {} as { [key: string]: any })
}

const matchAny = (
  definitions: Criteria[],
  qualifications: Qualification[],
): SimulationResult => {
  const matches = definitions.filter(
    d => qualifications.find(q => q.id == d.id) != undefined,
  )

  let points = 0
  if (matches.length > 0) {
    points = definitions[0].points
  }

  return { matches, points }
}

const matchMaxPoints = (
  definitions: Criteria[],
  value: any,
): SimulationResult => {
  let result: SimulationResult = { matches: [], points: 0 }

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
