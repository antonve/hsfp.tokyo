import { calculatePoints } from '@lib/domain/calculator'
import { Criteria, mapCriteriaById } from '@lib/domain/criteria'
import { CategoryMatcher } from '@lib/domain/calculator'
import { matchMaxPoints, matchAny } from '@lib/domain/matchers'
import { FormConfig } from '@lib/domain/form'
import {
  Qualification,
  QualificationWithValue,
} from '@lib/domain/qualifications'
import { errorMessages } from '@lib/visa/errors'

export const formConfig: FormConfig = {
  sections: {
    'academic-background': [
      {
        id: 'highest_degree',
        type: 'CHOICE',
        options: ['doctor', 'business_management', 'master', 'bachelor'],
      },
      {
        id: 'dual_degree',
        type: 'BOOLEAN',
      },
    ],
    career: [
      {
        id: 'experience',
        type: 'NUMBER',
        qualificationValueFieldName: 'yearsOfExperience',
      },
    ],
    age: [
      {
        id: 'age',
        type: 'NUMBER',
        qualificationValueFieldName: 'age',
      },
    ],
    'annual-salary': [
      {
        id: 'salary',
        type: 'NUMBER',
        qualificationValueFieldName: 'salary',
      },
    ],
    'research-achievements': [
      {
        id: 'patent_inventor',
        type: 'BOOLEAN',
      },
      {
        id: 'conducted_financed_projects_three_times',
        type: 'BOOLEAN',
      },
      {
        id: 'has_published_three_papers',
        type: 'BOOLEAN',
      },
      {
        id: 'research_recognized_by_japan',
        type: 'BOOLEAN',
      },
    ],
  },
  order: ['academic-background', 'career', 'age', 'annual-salary'],
}

export function calculatePointsForVisaB(qualifications: Qualification[]) {
  return calculatePoints(Object.values(matchersForVisaB), qualifications)
}

type CategoryVisaB =
  | 'academic-background'
  | 'career'
  | 'age'
  | 'annual-salary'
  | 'research-achievements'
  | 'licenses'
  | 'bonus'
  | 'contracting-organization'
  | 'japanese'
  | 'university'

const matchersForVisaB: {
  [category in CategoryVisaB]: CategoryMatcher
} = {
  'academic-background': {
    criteria: [
      { id: 'doctor', points: 30 },
      { id: 'business_management', points: 25 },
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
      { id: '10_years_or_more', points: 20, match: exp => exp >= 10 },
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
  'annual-salary': {
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
        q => q.category === 'annual-salary',
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
    criteria: [
      { id: 'patent_inventor', points: 15 },
      { id: 'conducted_financed_projects_three_times', points: 15 },
      { id: 'has_published_three_papers', points: 15 },
      { id: 'research_recognized_by_japan', points: 15 },
    ],
    match: (criteria, allQualifications) => {
      const qualifications = allQualifications.filter(
        q => q.category === 'research-achievements',
      )
      return matchAny(criteria, qualifications)
    },
  },
  licenses: {
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
      const match = qualifications.find(q => q.category === 'licenses') as
        | QualificationWithValue
        | undefined

      if (match === undefined) {
        return { matches: [], points: 0 }
      }

      const count = match.value
      return matchMaxPoints(criteria, count)
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
      {
        id: 'investment_management_business',
        points: 10,
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
