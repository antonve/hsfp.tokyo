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

export type Matcher<Q> = (q: Q) => MatchResult
