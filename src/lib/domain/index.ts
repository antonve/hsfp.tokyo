// The different types of HSFP visas
export enum VisaType {
  // Advanced academic research activities
  Researcher = 'researcher',
  // Advanced specialized/technical activities
  Engineer = 'engineer',
  // Advanced business management activities
  BusinessManager = 'business-manager',
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
