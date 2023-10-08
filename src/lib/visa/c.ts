import { Criteria, mapCriteriaById } from '@lib/domain/criteria'
import { CategoryMatcher, calculatePoints } from '@lib/domain/calculator'
import { errorMessages } from './errors'
import {
  filterUniqueQualifications,
  matchMaxPoints,
  matchAny,
} from '@lib/domain/matchers'
import {
  CareerQualification,
  AnnualSalaryQualification,
  Qualification,
} from '@lib/domain/qualifications'

export function calculatePointsForVisaC(qualifications: Qualification[]) {
  return calculatePoints(Object.values(matchersForVisaC), qualifications)
}

export type CategoryVisaC =
  | 'ACADEMIC_BACKGROUND'
  | 'CAREER'
  | 'ANNUAL_SALARY'
  | 'POSITION'
  | 'SPECIAL'
  | 'SPECIAL_CONTRACTING_ORGANIZATION'
  | 'SPECIAL_JAPANESE'
  | 'SPECIAL_UNIVERSITY'

const matchersForVisaC: {
  [category in CategoryVisaC]: CategoryMatcher
} = {
  ACADEMIC_BACKGROUND: {
    criteria: [
      { id: 'business_management', points: 25 },
      { id: 'master', points: 20 },
      { id: 'bachelor', points: 10 },
      { id: 'dual_degree', points: 5 },
    ],
    match: (criteria, allQualitifications) => {
      const qualifications = allQualitifications
        .filter(q => q.category === 'ACADEMIC_BACKGROUND')
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
  CAREER: {
    criteria: [
      { id: '10_years_or_more', points: 25, match: exp => exp >= 10 },
      { id: '7_years_or_more', points: 20, match: exp => exp >= 7 },
      { id: '5_years_or_more', points: 15, match: exp => exp >= 5 },
      { id: '3_years_or_more', points: 10, match: exp => exp >= 3 },
    ],
    match: (criteria, qualifications) => {
      const match = qualifications.find(q => q.category === 'CAREER') as
        | CareerQualification
        | undefined
      const yearsOfExperience = match?.yearsOfExperience ?? 0
      return matchMaxPoints(criteria, yearsOfExperience)
    },
  },
  ANNUAL_SALARY: {
    criteria: [
      {
        id: '30m_or_more',
        points: 50,
        match: ({ salary }) => salary >= 30_000_000,
      },
      {
        id: '25m_or_more',
        points: 40,
        match: ({ salary }) => salary >= 25_000_000,
      },
      {
        id: '20m_or_more',
        points: 30,
        match: ({ salary }) => salary >= 20_000_000,
      },
      {
        id: '15m_or_more',
        points: 20,
        match: ({ salary }) => salary >= 15_000_000,
      },
      {
        id: '10m_or_more',
        points: 10,
        match: ({ salary }) => salary >= 10_000_000,
      },
    ],
    match: (criteria, qualifications) => {
      const matchSalary = qualifications.find(
        q => q.category === 'ANNUAL_SALARY',
      ) as AnnualSalaryQualification | undefined

      if (matchSalary === undefined) {
        return { matches: [], points: 0 }
      }
      const salary = matchSalary.salary
      if (salary < 3_000_000) {
        throw new Error(errorMessages.salaryTooLow)
      }
      return matchMaxPoints(criteria, { salary })
    },
  },
  POSITION: {
    criteria: [
      {
        id: 'representative_director',
        points: 10,
      },
      {
        id: 'executive_officer',
        points: 5,
      },
    ],
    match: (criteria, allQualifications) => {
      const category = 'POSITION'
      return filterUniqueQualifications(criteria, allQualifications, category)
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
      {
        id: 'invested_over_100_million_yen_in_japan',
        points: 5,
      },
      {
        id: 'investment_management_business',
        points: 10,
      },
    ],
    match: (criteria, allQualifications) => {
      const category = 'SPECIAL'
      return filterUniqueQualifications(criteria, allQualifications, category)
    },
  },
  SPECIAL_CONTRACTING_ORGANIZATION: {
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
  SPECIAL_JAPANESE: {
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
        .filter(q => q.category === 'SPECIAL_JAPANESE')
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
    match: (criteria, allQualifications) => {
      const qualifications = allQualifications.filter(
        q => q.category === 'SPECIAL_UNIVERSITY',
      )

      return matchAny(criteria, qualifications)
    },
  },
}
