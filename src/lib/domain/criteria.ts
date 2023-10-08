// A Criteria is a row in the HSP points table.
// The points will be added to when a qualification matches with a criteria.
export interface Criteria {
  id: string
  points: number
  match?: (value: any) => boolean
}

export const mapCriteriaById = (criteria: Criteria[]) => {
  return criteria.reduce((accumulator, current) => {
    accumulator[current.id] = current
    return accumulator
  }, {} as { [key: string]: Criteria })
}
