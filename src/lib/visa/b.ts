import { calculatePoints } from '@lib/domain/calculator'
import { VisaType } from '@lib/domain/visa'
import { Criteria, mapCriteriaById } from '@lib/domain/criteria'
import { CategoryMatcher } from '@lib/domain/calculator'
import { matchMaxPoints, matchAny } from '@lib/domain/matchers'
import { Form } from '@lib/domain/form'
import {
  CareerQualification,
  AnnualSalaryQualification,
  AgeQualification,
  LicensesQualification,
  Qualification,
} from '@lib/domain/qualifications'
import { errorMessages } from '@lib/visa/errors'

export const form: Form = {
  visa: VisaType.B, //fix
  sections: [
    {
      category: 'ACADEMIC_BACKGROUND',
      prompts: [
        {
          id: 'HIGHEST_DEGREE',
          type: 'CHOICE',
          options: [
            'doctor',
            'business_management',
            'master',
            'bachelor',
            'fallback',
          ],
        },
        {
          id: 'DUAL_DEGREE',
          type: 'CHOICE',
          options: ['dual_degree', 'fallback'],
        },
      ],
    },
  ],
}

export function calculatePointsForVisaB(qualifications: Qualification[]) {
  return calculatePoints(Object.values(matchersForVisaB), qualifications)
}

type CategoryVisaB =
  | 'ACADEMIC_BACKGROUND'
  | 'CAREER'
  | 'AGE'
  | 'ANNUAL_SALARY'
  | 'RESEARCH_ACHIEVEMENTS'
  | 'LICENSES'
  | 'SPECIAL'
  | 'SPECIAL_CONTRACTING_ORGANIZATION'
  | 'SPECIAL_JAPANESE'
  | 'SPECIAL_UNIVERSITY'

const matchersForVisaB: {
  [category in CategoryVisaB]: CategoryMatcher
} = {
  ACADEMIC_BACKGROUND: {
    criteria: [
      { id: 'doctor', points: 30 },
      { id: 'business_management', points: 25 },
      { id: 'master', points: 20 },
      { id: 'bachelor', points: 10 },
      { id: 'dual_degree', points: 5 },
    ],
    match: (criteria, allQualifications) => {
      const qualifications = allQualifications
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
      { id: '10_years_or_more', points: 20, match: exp => exp >= 10 },
      { id: '7_years_or_more', points: 15, match: exp => exp >= 7 },
      { id: '5_years_or_more', points: 10, match: exp => exp >= 5 },
      { id: '3_years_or_more', points: 5, match: exp => exp >= 3 },
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
        q => q.category === 'ANNUAL_SALARY',
      ) as AnnualSalaryQualification | undefined
      const matchAge = qualifications.find(q => q.category === 'AGE') as
        | AgeQualification
        | undefined

      if (matchSalary === undefined || matchAge == undefined) {
        return { matches: [], points: 0 }
      }

      const age = matchAge.age
      const salary = matchSalary.salary
      if (salary < 3_000_000) {
        throw new Error(errorMessages.salaryTooLow)
      }

      return matchMaxPoints(criteria, { salary, age })
    },
  },
  AGE: {
    criteria: [
      { id: 'less_than_30', points: 15, match: age => age < 30 },
      { id: 'less_than_35', points: 10, match: age => age < 35 },
      { id: 'less_than_40', points: 5, match: age => age < 40 },
    ],
    match: (criteria, qualifications) => {
      const match = qualifications.find(q => q.category === 'AGE') as
        | AgeQualification
        | undefined

      if (match === undefined) {
        return { matches: [], points: 0 }
      }

      const age = match.age
      return matchMaxPoints(criteria, age)
    },
  },
  RESEARCH_ACHIEVEMENTS: {
    criteria: [
      { id: 'patent_inventor', points: 15 },
      { id: 'conducted_financed_projects_three_times', points: 15 },
      { id: 'has_published_three_papers', points: 15 },
      { id: 'research_recognized_by_japan', points: 15 },
    ],
    match: (criteria, allQualifications) => {
      const qualifications = allQualifications.filter(
        q => q.category === 'RESEARCH_ACHIEVEMENTS',
      )
      return matchAny(criteria, qualifications)
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
    match: (criteria, qualifications) => {
      const match = qualifications.find(q => q.category === 'LICENSES') as
        | LicensesQualification
        | undefined

      if (match === undefined) {
        return { matches: [], points: 0 }
      }

      const count = match.count
      return matchMaxPoints(criteria, count)
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
    match: (criteria, allQualifications) => {
      const qualifications = allQualifications
        .filter(q => q.category === 'SPECIAL')
        .map(q => q.id)

      const matches = criteria.filter(c => qualifications.includes(c.id))
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
