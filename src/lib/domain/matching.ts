import { MatchResult, Matcher } from '@lib/domain'

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
