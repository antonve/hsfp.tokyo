import {
  calculatePoints,
  errorMessages,
  Checklist,
  Criteria,
  CriteriaAge,
  CriteriaAnnualSalary,
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

  function annualSalaryOf(salary: number): CriteriaAnnualSalary {
    return {
      category: CriteriaCategory.AnnualSalary,
      id: 'salary',
      salary,
    }
  }
  describe('annual salary', () => {
    it('12,500,000 JPY', () => {
      const checklist = checklistWithCriteria([annualSalaryOf(12_500_000)])

      const points = calculatePoints(checklist)

      expect(points).toBe(40)
    })

    it('9,999,999 JPY', () => {
      const checklist = checklistWithCriteria([annualSalaryOf(9_999_999)])

      const points = calculatePoints(checklist)

      expect(points).toBe(35)
    })

    it('5,000,000', () => {
      const checklist = checklistWithCriteria([annualSalaryOf(5_000_000)])

      const points = calculatePoints(checklist)

      expect(points).toBe(15)
    })

    it('3,000,000', () => {
      const checklist = checklistWithCriteria([annualSalaryOf(3_000_000)])

      const points = calculatePoints(checklist)

      expect(points).toBe(0)
    })

    it('2,999,999', () => {
      const checklist = checklistWithCriteria([annualSalaryOf(2_999_999)])

      expect(() => {
        calculatePoints(checklist)
      }).toThrowError(errorMessages.salaryTooLow)
    })
  })

  function ageOf(age: number): CriteriaAge {
    return {
      category: CriteriaCategory.Age,
      id: 'age',
      age,
    }
  }
  describe('age', () => {
    it('29 years old', () => {
      const checklist = checklistWithCriteria([ageOf(29)])

      const points = calculatePoints(checklist)

      expect(points).toBe(15)
    })

    it('34 years old', () => {
      const checklist = checklistWithCriteria([ageOf(34)])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('35 years old', () => {
      const checklist = checklistWithCriteria([ageOf(35)])

      const points = calculatePoints(checklist)

      expect(points).toBe(5)
    })

    it('40 years old', () => {
      const checklist = checklistWithCriteria([ageOf(40)])

      const points = calculatePoints(checklist)

      expect(points).toBe(0)
    })
  })
})
