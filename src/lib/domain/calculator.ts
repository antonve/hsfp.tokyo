// The different types of HSFP visas
// TODO: Rename from A | B | C to more generic name
export enum VisaType {
  // Advanced academic research activities
  A = 'A',
  // Advanced specialized/technical activities
  B = 'B',
  // Advanced business management activities
  C = 'C',
}

// A Criteria is a row in the HSP points table.
export interface Criteria {
  id: string
  points: number
}

export interface MatchResult {
  matches: Criteria[]
  points: number
}

export function matchQualifications<Q>(
  matchers: Matcher<Q>[],
  qualifications: Q,
) {
  const matches = matchers.map(match => match(qualifications))

  return matches.reduce(
    (accumulator, current) => {
      return {
        matches: accumulator.matches.concat(current.matches),
        points: accumulator.points + current.points,
      }
    },
    {
      matches: [],
      points: 0,
    } as MatchResult,
  )
}

export type Matcher<Q> = (q: Q) => MatchResult

// Helpers for Matcher functions

export const NO_MATCHES: MatchResult = { matches: [], points: 0 }

export function matchOf(id: string, points: number) {
  return {
    matches: [{ id, points }],
    points: points,
  }
}

export function mergeMatches(matches: MatchResult[]) {
  const mergedCriteria = matches
    .map(it => it.matches)
    .reduce((prev, current) => prev.concat(current), [])

  const points = matches
    .map(it => it.points)
    .reduce((prev, current) => prev + current, 0)

  return {
    matches: mergedCriteria,
    points,
  } as MatchResult
}

export function limitPoints(match: MatchResult, limit: number) {
  return {
    ...match,
    points: Math.min(match.points, limit),
  }
}
