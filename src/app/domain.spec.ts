import {
  calculatePoints,
  Checklist,
  Criteria,
  CriteriaProfessionalCareer,
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

  function academicBackgroundWith({ degree }: { degree: string }): Criteria {
    return {
      category: CriteriaCategory.AcademicBackground,
      id: degree,
    }
  }

  describe('academic background', () => {
    it('single degree', () => {
      const checklist = checklistWithCriteria([
        academicBackgroundWith({ degree: 'doctor' }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(30)
    })

    it('multiple degrees, should pick highest degree', () => {
      const checklist = checklistWithCriteria([
        academicBackgroundWith({ degree: 'master' }),
        academicBackgroundWith({ degree: 'bachelor' }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(20)
    })

    it('a dual degree should give bonus', () => {
      const checklist = checklistWithCriteria([
        academicBackgroundWith({ degree: 'master' }),
        academicBackgroundWith({ degree: 'bachelor' }),
        academicBackgroundWith({ degree: 'dual_degree' }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(25)
    })
  })

  function professionalCareerWith({
    yearsOfExperience,
  }: {
    yearsOfExperience: number
  }): CriteriaProfessionalCareer {
    return {
      category: CriteriaCategory.ProfessionalCareer,
      id: 'experience',
      yearsOfExperience,
    }
  }

  describe('professional career', () => {
    it('10 years of experience', () => {
      const checklist = checklistWithCriteria([
        professionalCareerWith({ yearsOfExperience: 15 }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(20)
    })

    it('4 years of experience', () => {
      const checklist = checklistWithCriteria([
        professionalCareerWith({ yearsOfExperience: 4 }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(5)
    })

    it('1 year of experience', () => {
      const checklist = checklistWithCriteria([
        professionalCareerWith({ yearsOfExperience: 1 }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(0)
    })
  })
})
