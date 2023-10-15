import { Matcher, calculatePoints } from '@lib/domain/calculator'
import { Qualifications } from '@lib/domain/qualifications'
import { FormConfig } from '@lib/domain/form'
import { errorMessages } from './errors'

export const formConfig: FormConfig = {
  sections: {},
  order: [],
}

export function calculatePointsForVisaA(qualifications: Qualifications) {
  return calculatePoints(matchers, qualifications)
}

const NO_MATCHES = { matches: [], points: 0 }

function matchOf(id: string, points: number) {
  return {
    matches: [{ id, points }],
    points: points,
  }
}

const matchers: Matcher[] = [
  function matchDegree(q) {
    switch (q.degree) {
      case 'doctor':
        return matchOf('doctor', 30)
      case 'doctor':
        return matchOf('master', 20)
      case 'doctor':
        return matchOf('bachelor', 20)
      default:
        return NO_MATCHES
    }
  },
  function matchDualDegree(q) {
    // Dual degree does not apply if we have no degree
    if (!q.degree || q.degree === 'none') {
      return NO_MATCHES
    }

    if (!q.dual_degree) {
      return NO_MATCHES
    }

    return matchOf('dual_degree', 5)
  },
  function matchWorkExperience(q) {
    const experience = q.experience ?? 0

    if (experience >= 7) {
      return matchOf('7y_plus', 15)
    }
    if (experience >= 5) {
      return matchOf('5y_plus', 10)
    }
    if (experience >= 3) {
      return matchOf('3y_plus', 5)
    }

    return NO_MATCHES
  },
  function matchSalary(q) {
    // We need to allow missing salary when we haven't completed the form yet
    if (!q.salary) {
      return NO_MATCHES
    }

    const salary = q.salary ?? 0
    const age = q.age ?? 100

    if (salary >= 10_000_000) {
      return matchOf('10m_plus', 40)
    }
    if (salary >= 9_000_000) {
      return matchOf('9m_plus', 35)
    }
    if (salary >= 8_000_000) {
      return matchOf('8m_plus', 30)
    }
    if (salary >= 7_000_000 && age < 40) {
      return matchOf('7m_plus', 25)
    }
    if (salary >= 6_000_000 && age < 40) {
      return matchOf('6m_plus', 20)
    }
    if (salary >= 5_000_000 && age < 35) {
      return matchOf('5m_plus', 15)
    }
    if (salary >= 4_000_000 && age < 30) {
      return matchOf('4m_plus', 10)
    }
    if (salary >= 3_000_000) {
      return NO_MATCHES
    }

    throw new Error(errorMessages.salaryTooLow)
  },
  // TODO
  function matchAge(q) {
    return NO_MATCHES
  },
  function matchResearchAchievements(q) {
    return NO_MATCHES
  },
  function matchBonus(q) {
    return NO_MATCHES
  },
  function matchContractingOrganization(q) {
    return NO_MATCHES
  },
  function matchJapanese(q) {
    return NO_MATCHES
  },
  function matchUniversity(q) {
    return NO_MATCHES
  },
]
//   age: {
//     criteria: [
//       { id: 'less_than_30', points: 15, match: age => age < 30 },
//       { id: 'less_than_35', points: 10, match: age => age < 35 },
//       { id: 'less_than_40', points: 5, match: age => age < 40 },
//     ],
//     match: (criteria, qualifications) => {
//       const match = qualifications.find(q => q.category === 'age') as
//         | QualificationWithValue
//         | undefined

//       if (match === undefined) {
//         return { matches: [], points: 0 }
//       }

//       const age = match.value
//       return matchMaxPoints(criteria, age)
//     },
//   },
//   'research-achievements': {
//     // threshold: 2, bonus: 5
//     criteria: [
//       { id: 'patent_inventor', points: 20 },
//       { id: 'conducted_financed_projects_three_times', points: 20 },
//       { id: 'has_published_three_papers', points: 20 },
//       { id: 'research_recognized_by_japan', points: 20 },
//     ],
//     match: (criteria, allQualifications) => {
//       const qualifications = allQualifications.filter(
//         q => q.category === 'research-achievements',
//       )
//       const threshold = 2
//       const bonus = 5
//       return matchQualificationsWithExtraPoints(
//         criteria,
//         qualifications,
//         threshold,
//         bonus,
//       )
//     },
//   },
//   bonus: {
//     criteria: [
//       { id: 'rnd_exceeds_three_percent', points: 5 },
//       { id: 'foreign_work_related_qualification', points: 5 },
//       { id: 'advanced_project_growth_field', points: 10 },
//       {
//         id: 'completed_training_conducted_by_jica_innovative_asia_project',
//         points: 5,
//       },
//     ],
//     match: (criteria, allQualifications) => {
//       const qualifications = allQualifications
//         .filter(q => q.category === 'bonus')
//         .map(q => q.id)

//       const matches = criteria.filter(c => qualifications.includes(c.id))
//       const points = matches.reduce(
//         (accumulator, current) => accumulator + current.points,
//         0,
//       )
//       return { matches, points }
//     },
//   },
//   'contracting-organization': {
//     criteria: [
//       { id: 'contracting_organization_promotes_innovation', points: 10 },
//       { id: 'contracting_organization_small_medium_sized', points: 10 },
//       { id: 'contracting_organization_promotes_highly_skilled', points: 10 },
//     ],
//     match: (allCriteria, allQualifications) => {
//       let points = 0
//       let matches: Criteria[] = []

//       const criteria = mapCriteriaById(allCriteria)
//       const qualifications = allQualifications
//         .filter(q => q.category === 'contracting-organization')
//         .map(q => q.id)
//       const isInnovative = qualifications.includes(
//         'contracting_organization_promotes_innovation',
//       )
//       const isSmallCompany = qualifications.includes(
//         'contracting_organization_small_medium_sized',
//       )
//       const isPromotingHighlySkilled = qualifications.includes(
//         'contracting_organization_promotes_highly_skilled',
//       )

//       if (isInnovative) {
//         matches.push(criteria['contracting_organization_promotes_innovation'])
//         points +=
//           criteria['contracting_organization_promotes_innovation'].points
//       }
//       if (isInnovative && isSmallCompany) {
//         matches.push(criteria['contracting_organization_small_medium_sized'])
//         points += criteria['contracting_organization_small_medium_sized'].points
//       }
//       if (isPromotingHighlySkilled) {
//         matches.push(
//           criteria['contracting_organization_promotes_highly_skilled'],
//         )
//         points +=
//           criteria['contracting_organization_promotes_highly_skilled'].points
//       }

//       return { matches, points }
//     },
//   },
//   japanese: {
//     criteria: [
//       { id: 'graduated_japanese_uni_or_course', points: 10 },
//       { id: 'jlpt_n1_or_equivalent', points: 15 },
//       { id: 'jlpt_n2_or_equivalent', points: 10 },
//     ],
//     match: (allCriteria, allQualifications) => {
//       let points = 0
//       let matches: Criteria[] = []

//       const criteria = mapCriteriaById(allCriteria)
//       const qualifications = allQualifications
//         .filter(q => q.category === 'japanese')
//         .map(q => q.id)
//       const isUniGraduate = qualifications.includes(
//         'graduated_japanese_uni_or_course',
//       )
//       const hasN1 = qualifications.includes('jlpt_n1_or_equivalent')
//       const hasN2 = qualifications.includes('jlpt_n2_or_equivalent')

//       if (hasN2 && !hasN1 && !isUniGraduate) {
//         matches.push(criteria['jlpt_n2_or_equivalent'])
//         points += criteria['jlpt_n2_or_equivalent'].points
//       }
//       if (hasN1) {
//         matches.push(criteria['jlpt_n1_or_equivalent'])
//         points += criteria['jlpt_n1_or_equivalent'].points
//       }
//       if (isUniGraduate) {
//         matches.push(criteria['graduated_japanese_uni_or_course'])
//         points += criteria['graduated_japanese_uni_or_course'].points
//       }

//       return { matches, points }
//     },
//   },
//   university: {
//     criteria: [
//       { id: 'top_ranked_university_graduate', points: 10 },
//       {
//         id: 'graduate_of_university_funded_by_top_global_universities_project',
//         points: 10,
//       },
//       {
//         id: 'graduate_of_university_partner_school',
//         points: 10,
//       },
//     ],
//     match: (criteria, allQualifications) => {
//       const qualifications = allQualifications.filter(
//         q => q.category === 'university',
//       )

//       return matchAny(criteria, qualifications)
//     },
//   },
// }
