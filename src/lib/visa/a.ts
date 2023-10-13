import { calculatePoints } from '@lib/domain/calculator'
import { VisaType } from '@lib/domain/visa'
import { Criteria, mapCriteriaById } from '@lib/domain/criteria'
import { CategoryMatcher } from '@lib/domain/calculator'
import { errorMessages } from './errors'
import {
  matchMaxPoints,
  matchAny,
  matchQualificationsWithExtraPoints,
} from '@lib/domain/matchers'
import {
  QualificationWithValue,
  Qualification,
} from '@lib/domain/qualifications'

// todo: add forms configuration

export function calculatePointsForVisaA(qualifications: Qualification[]) {
  return calculatePoints(Object.values(matchersForVisaA), qualifications)
}

type CategoryVisaA =
  | 'academic-background'
  | 'career'
  | 'compensation'
  | 'age'
  | 'research-achievements'
  | 'bonus'
  | 'contracting-organization'
  | 'japanese'
  | 'university'

const matchersForVisaA: {
  [category in CategoryVisaA]: CategoryMatcher
} = {
  'academic-background': {
    criteria: [
      { id: 'doctor', points: 30 },
      { id: 'master', points: 20 },
      { id: 'bachelor', points: 10 },
      { id: 'dual_degree', points: 5 },
    ],
    match: (criteria, allQualifications) => {
      const qualifications = allQualifications
        .filter(q => q.category === 'academic-background')
        .map(q => q.id)

      const degrees = criteria.filter(c => qualifications.includes(c.id))
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
  career: {
    criteria: [
      { id: '7_years_or_more', points: 15, match: exp => exp >= 7 },
      { id: '5_years_or_more', points: 10, match: exp => exp >= 5 },
      { id: '3_years_or_more', points: 5, match: exp => exp >= 3 },
    ],
    match: (criteria, qualifications) => {
      const match = qualifications.find(q => q.category === 'career') as
        | QualificationWithValue
        | undefined
      const yearsOfExperience = match?.value ?? 0

      return matchMaxPoints(criteria, yearsOfExperience)
    },
  },
  compensation: {
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
    match: (criteria, qualifications) => {
      const matchSalary = qualifications.find(
        q => q.category === 'compensation',
      ) as QualificationWithValue | undefined
      const matchAge = qualifications.find(q => q.category === 'age') as
        | QualificationWithValue
        | undefined

      if (matchSalary === undefined || matchAge == undefined) {
        return { matches: [], points: 0 }
      }

      const age = matchAge.value
      const salary = matchSalary.value
      if (salary < 3_000_000) {
        throw new Error(errorMessages.salaryTooLow)
      }

      return matchMaxPoints(criteria, { salary, age })
    },
  },
  age: {
    criteria: [
      { id: 'less_than_30', points: 15, match: age => age < 30 },
      { id: 'less_than_35', points: 10, match: age => age < 35 },
      { id: 'less_than_40', points: 5, match: age => age < 40 },
    ],
    match: (criteria, qualifications) => {
      const match = qualifications.find(q => q.category === 'age') as
        | QualificationWithValue
        | undefined

      if (match === undefined) {
        return { matches: [], points: 0 }
      }

      const age = match.value
      return matchMaxPoints(criteria, age)
    },
  },
  'research-achievements': {
    // threshold: 2, bonus: 5
    criteria: [
      { id: 'patent_inventor', points: 20 },
      { id: 'conducted_financed_projects_three_times', points: 20 },
      { id: 'has_published_three_papers', points: 20 },
      { id: 'research_recognized_by_japan', points: 20 },
    ],
    match: (criteria, allQualifications) => {
      const qualifications = allQualifications.filter(
        q => q.category === 'research-achievements',
      )
      const threshold = 2
      const bonus = 5
      return matchQualificationsWithExtraPoints(
        criteria,
        qualifications,
        threshold,
        bonus,
      )
    },
  },
  bonus: {
    criteria: [
      { id: 'rnd_exceeds_three_percent', points: 5 },
      { id: 'foreign_work_related_qualification', points: 5 },
      { id: 'advanced_project_growth_field', points: 10 },
      {
        id: 'completed_training_conducted_by_jica_innovative_asia_project',
        points: 5,
      },
    ],
    match: (criteria, allQualifications) => {
      const qualifications = allQualifications
        .filter(q => q.category === 'bonus')
        .map(q => q.id)

      const matches = criteria.filter(c => qualifications.includes(c.id))
      const points = matches.reduce(
        (accumulator, current) => accumulator + current.points,
        0,
      )
      return { matches, points }
    },
  },
  'contracting-organization': {
    criteria: [
      { id: 'contracting_organization_promotes_innovation', points: 10 },
      { id: 'contracting_organization_small_medium_sized', points: 10 },
      { id: 'contracting_organization_promotes_highly_skilled', points: 10 },
    ],
    match: (allCriteria, allQualifications) => {
      let points = 0
      let matches: Criteria[] = []

      const criteria = mapCriteriaById(allCriteria)
      const qualifications = allQualifications
        .filter(q => q.category === 'contracting-organization')
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
        matches.push(criteria['contracting_organization_promotes_innovation'])
        points +=
          criteria['contracting_organization_promotes_innovation'].points
      }
      if (isInnovative && isSmallCompany) {
        matches.push(criteria['contracting_organization_small_medium_sized'])
        points += criteria['contracting_organization_small_medium_sized'].points
      }
      if (isPromotingHighlySkilled) {
        matches.push(
          criteria['contracting_organization_promotes_highly_skilled'],
        )
        points +=
          criteria['contracting_organization_promotes_highly_skilled'].points
      }

      return { matches, points }
    },
  },
  japanese: {
    criteria: [
      { id: 'graduated_japanese_uni_or_course', points: 10 },
      { id: 'jlpt_n1_or_equivalent', points: 15 },
      { id: 'jlpt_n2_or_equivalent', points: 10 },
    ],
    match: (allCriteria, allQualifications) => {
      let points = 0
      let matches: Criteria[] = []

      const criteria = mapCriteriaById(allCriteria)
      const qualifications = allQualifications
        .filter(q => q.category === 'japanese')
        .map(q => q.id)
      const isUniGraduate = qualifications.includes(
        'graduated_japanese_uni_or_course',
      )
      const hasN1 = qualifications.includes('jlpt_n1_or_equivalent')
      const hasN2 = qualifications.includes('jlpt_n2_or_equivalent')

      if (hasN2 && !hasN1 && !isUniGraduate) {
        matches.push(criteria['jlpt_n2_or_equivalent'])
        points += criteria['jlpt_n2_or_equivalent'].points
      }
      if (hasN1) {
        matches.push(criteria['jlpt_n1_or_equivalent'])
        points += criteria['jlpt_n1_or_equivalent'].points
      }
      if (isUniGraduate) {
        matches.push(criteria['graduated_japanese_uni_or_course'])
        points += criteria['graduated_japanese_uni_or_course'].points
      }

      return { matches, points }
    },
  },
  university: {
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
    match: (criteria, allQualifications) => {
      const qualifications = allQualifications.filter(
        q => q.category === 'university',
      )

      return matchAny(criteria, qualifications)
    },
  },
}
