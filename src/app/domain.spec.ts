import {
  calculatePoints,
  Checklist,
  Criteria,
  CriteriaCategory,
  VisaType,
} from '@app/domain'

describe('Visa type B point calculation', () => {
  function checklistWithCriteria(criteria: Criteria[]): Checklist {
    return {
      visaType: VisaType.B,
      matchingCriteria: criteria,
    }
  }

  it('can calculate some points', () => {
    const checklist = checklistWithCriteria([
      { category: CriteriaCategory.AcademicBackground, id: 'doctor' },
    ])

    const points = calculatePoints(checklist)

    expect(points).toBe(30)
  })
})
