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

  describe('academic background', () => {
    it('single degree', () => {
      const checklist = checklistWithCriteria([
        { category: CriteriaCategory.AcademicBackground, id: 'doctor' },
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(30)
    })

    it('multiple degrees, should pick highest degree', () => {
      const checklist = checklistWithCriteria([
        { category: CriteriaCategory.AcademicBackground, id: 'master' },
        { category: CriteriaCategory.AcademicBackground, id: 'bachelor' },
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(20)
    })

    it('a dual degree should give bonus', () => {
      const checklist = checklistWithCriteria([
        { category: CriteriaCategory.AcademicBackground, id: 'master' },
        { category: CriteriaCategory.AcademicBackground, id: 'bachelor' },
        { category: CriteriaCategory.AcademicBackground, id: 'dual_degree' },
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(25)
    })
  })
})
