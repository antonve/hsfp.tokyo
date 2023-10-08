import { Criteria } from '@lib/domain/criteria'
import { Qualification } from '@lib/domain/qualifications'

// TODO: this can be replaced with matchQualificationWithMostPoints
export const matchAny = (
  criteria: Criteria[],
  qualifications: Qualification[],
) => {
  const matches = criteria.filter(
    c => qualifications.find(q => q.id == c.id) != undefined,
  )

  let points = 0
  // TODO: Is this logic sound?
  if (matches.length > 0) {
    points = criteria[0].points
  }

  return { matches, points }
}

// TODO: rename to matchQualificationWithMostPoints
export const matchMaxPoints = (allCriteria: Criteria[], value: any) => {
  let result = { matches: [] as Criteria[], points: 0 }

  allCriteria.forEach(criteria => {
    if (criteria.match?.(value) ?? false) {
      if (result.points < criteria.points) {
        result.points = criteria.points
        result.matches = [criteria]
      }
    }
  })

  return result
}

// TODO: rename to matchAllQualifications
export const filterUniqueQualifications = (
  criteria: Criteria[],
  allQualifications: Qualification[],
  category: String,
) => {
  const qualifications = allQualifications
    .filter(q => q.category === category)
    .map(q => q.id)
  const matches = criteria.filter(c => qualifications.includes(c.id))
  const points = matches.reduce(
    (accumulator, current) => accumulator + current.points,
    0,
  )
  return { matches, points }
}

export const matchQualificationsWithExtraPoints = (
  criteria: Criteria[],
  qualifications: Qualification[],
  threshold: number,
  bonus: number
) => {
  const matches = criteria.filter(
    c => qualifications.find(q => q.id == c.id) != undefined,
  )
  let points = 0
  if (matches.length >= threshold) {
    // give bonus
    points = criteria[0].points + bonus
    return { matches, points }
  }
  // give only one point of criteria
  return matchAny(criteria, qualifications)
}