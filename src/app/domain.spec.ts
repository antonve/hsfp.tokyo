import {
  calculatePoints,
  errorMessages,
  Checklist,
  Criteria,
  CriteriaAge,
  CriteriaAnnualSalary,
  CriteriaProfessionalCareer,
  CriteriaLicenses,
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
    it('12,500,000 JPY @ 50 years old', () => {
      const checklist = checklistWithCriteria([
        annualSalaryOf(12_500_000),
        ageOf(50),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(40)
    })

    it('9,999,999 JPY @ 50 years old', () => {
      const checklist = checklistWithCriteria([
        annualSalaryOf(9_999_999),
        ageOf(50),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(35)
    })

    it('5,000,000 @ 34 years old', () => {
      const checklist = checklistWithCriteria([
        annualSalaryOf(5_000_000), // 15 points
        ageOf(34), // 10 points
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(25)
    })

    it('5,000,000 @ 35 years old', () => {
      const checklist = checklistWithCriteria([
        annualSalaryOf(5_000_000), // 0 points
        ageOf(35), // 5 points
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(5)
    })

    it('3,000,000 @ 20 years old', () => {
      const checklist = checklistWithCriteria([
        annualSalaryOf(3_000_000), // 0 points
        ageOf(20), // 15 points
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(15)
    })

    it('2,999,999 @ 24 years old', () => {
      const checklist = checklistWithCriteria([
        annualSalaryOf(2_999_999),
        ageOf(24),
      ])

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

  function researchAchievementOf({ kind }: { kind: string }): Criteria {
    return {
      category: CriteriaCategory.ResearchAchievements,
      id: kind,
    }
  }

  describe('research achievements', () => {
    it('have at least one patent', () => {
      const checklist = checklistWithCriteria([
        researchAchievementOf({ kind: 'patent_inventor' }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(15)
    })

    it('conducted financed projects', () => {
      const checklist = checklistWithCriteria([
        researchAchievementOf({ kind: 'conducted_financed_projects' }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(15)
    })

    it('has published three or more papers', () => {
      const checklist = checklistWithCriteria([
        researchAchievementOf({ kind: 'has_published_three_papers' }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(15)
    })

    it('research is recognized by japan', () => {
      const checklist = checklistWithCriteria([
        researchAchievementOf({ kind: 'research_recognized_by_japan' }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(15)
    })

    it('having multiple research achievements should count as one', () => {
      const checklist = checklistWithCriteria([
        researchAchievementOf({ kind: 'patent_inventor' }),
        researchAchievementOf({ kind: 'has_published_three_papers' }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(15)
    })
  })

  function licenseHolder({ count }: { count: number }): CriteriaLicenses {
    return {
      category: CriteriaCategory.Licenses,
      id: 'licenses',
      count,
    }
  }

  describe('national licenses', () => {
    it('has three national licenses', () => {
      const checklist = checklistWithCriteria([licenseHolder({ count: 3 })])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('has two national licenses', () => {
      const checklist = checklistWithCriteria([licenseHolder({ count: 2 })])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('has one national license', () => {
      const checklist = checklistWithCriteria([licenseHolder({ count: 1 })])

      const points = calculatePoints(checklist)

      expect(points).toBe(5)
    })

    it('has no national licenses', () => {
      const checklist = checklistWithCriteria([licenseHolder({ count: 0 })])

      const points = calculatePoints(checklist)

      expect(points).toBe(0)
    })
  })

  function specialOf({ kind: id }: { kind: string }): Criteria {
    return {
      category: CriteriaCategory.Special,
      id,
    }
  }

  describe('special', () => {
    it('knows to ignore duplicates', () => {
      const checklist = checklistWithCriteria([
        specialOf({ kind: 'rnd_exceeds_three_percent' }),
        specialOf({ kind: 'rnd_exceeds_three_percent' }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(5)
    })

    it('research and development exceeds 3%', () => {
      const checklist = checklistWithCriteria([
        specialOf({ kind: 'rnd_exceeds_three_percent' }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(5)
    })

    it('has foreign work related qualification', () => {
      const checklist = checklistWithCriteria([
        specialOf({ kind: 'foreign_work_related_qualification' }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(5)
    })

    it('has worked on an advanced project in a growth field', () => {
      const checklist = checklistWithCriteria([
        specialOf({ kind: 'advanced_project_growth_field' }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('completed training conducted by JICA as part of Innovative Asia Project', () => {
      const checklist = checklistWithCriteria([
        specialOf({
          kind: 'completed_training_conducted_by_jica_innovative_asia_project',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(5)
    })

    it('qualifies for all special criteria', () => {
      const checklist = checklistWithCriteria([
        specialOf({ kind: 'rnd_exceeds_three_percent' }),
        specialOf({ kind: 'foreign_work_related_qualification' }),
        specialOf({ kind: 'advanced_project_growth_field' }),
        specialOf({
          kind: 'completed_training_conducted_by_jica_innovative_asia_project',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(25)
    })
  })

  function contractingOrganizationOf({ kind: id }: { kind: string }): Criteria {
    return {
      category: CriteriaCategory.SpecialContractingOrganization,
      id,
    }
  }

  describe('contracting organization', () => {
    it('knows to ignore duplicates', () => {
      const checklist = checklistWithCriteria([
        contractingOrganizationOf({
          kind: 'contracting_organization_promotes_highly_skilled',
        }),
        contractingOrganizationOf({
          kind: 'contracting_organization_promotes_highly_skilled',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('promotes innovation', () => {
      const checklist = checklistWithCriteria([
        contractingOrganizationOf({
          kind: 'contracting_organization_promotes_innovation',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('promotes innovation & small-medium sized company', () => {
      const checklist = checklistWithCriteria([
        contractingOrganizationOf({
          kind: 'contracting_organization_promotes_innovation',
        }),
        contractingOrganizationOf({
          kind: 'contracting_organization_small_medium_sized',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(20)
    })

    it('promotes highly skilled professionals & innovation & small-medium sized company', () => {
      const checklist = checklistWithCriteria([
        contractingOrganizationOf({
          kind: 'contracting_organization_promotes_innovation',
        }),
        contractingOrganizationOf({
          kind: 'contracting_organization_small_medium_sized',
        }),
        contractingOrganizationOf({
          kind: 'contracting_organization_promotes_highly_skilled',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(30)
    })

    it('ignores small-medium sized company when not promoting innovation', () => {
      const checklist = checklistWithCriteria([
        contractingOrganizationOf({
          kind: 'contracting_organization_small_medium_sized',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(0)
    })

    it('promotes highly skilled professionals', () => {
      const checklist = checklistWithCriteria([
        contractingOrganizationOf({
          kind: 'contracting_organization_promotes_highly_skilled',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })
  })

  function japanese({ kind: id }: { kind: string }): Criteria {
    return {
      category: CriteriaCategory.SpecialJapanese,
      id,
    }
  }

  describe('japanese ability', () => {
    it('knows to ignore duplicates', () => {
      const checklist = checklistWithCriteria([
        japanese({
          kind: 'graduated_japanese_uni_or_course',
        }),
        japanese({
          kind: 'graduated_japanese_uni_or_course',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('graduated japanese university', () => {
      const checklist = checklistWithCriteria([
        japanese({
          kind: 'graduated_japanese_uni_or_course',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('has jlpt n1 or equivalent', () => {
      const checklist = checklistWithCriteria([
        japanese({
          kind: 'jlpt_n1_or_equivalent',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(15)
    })

    it('has jlpt n2 or equivalent', () => {
      const checklist = checklistWithCriteria([
        japanese({
          kind: 'jlpt_n2_or_equivalent',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('ignores jlpt n2 or equivalent if graduated from japanese university', () => {
      const checklist = checklistWithCriteria([
        japanese({
          kind: 'jlpt_n2_or_equivalent',
        }),
        japanese({
          kind: 'graduated_japanese_uni_or_course',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('ignores jlpt n2 or equivalent when having n1', () => {
      const checklist = checklistWithCriteria([
        japanese({
          kind: 'jlpt_n2_or_equivalent',
        }),
        japanese({
          kind: 'jlpt_n1_or_equivalent',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(15)
    })

    it('has jlpt n1 or equivalent and graduated from japanese university', () => {
      const checklist = checklistWithCriteria([
        japanese({
          kind: 'jlpt_n1_or_equivalent',
        }),
        japanese({
          kind: 'graduated_japanese_uni_or_course',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(25)
    })
  })

  function universityOf({ kind: id }: { kind: string }): Criteria {
    return {
      category: CriteriaCategory.SpecialUniversity,
      id,
    }
  }

  describe('university', () => {
    it('knows to ignore duplicates', () => {
      const checklist = checklistWithCriteria([
        universityOf({
          kind: 'top_ranked_university_graduate',
        }),
        universityOf({
          kind: 'top_ranked_university_graduate',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('is a top 300 university', () => {
      const checklist = checklistWithCriteria([
        universityOf({
          kind: 'top_ranked_university_graduate',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('is funded by top global universities project', () => {
      const checklist = checklistWithCriteria([
        universityOf({
          kind:
            'graduate_of_university_funded_by_top_global_universities_project',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('is designated partner school in the innovative asia project', () => {
      const checklist = checklistWithCriteria([
        universityOf({
          kind: 'graduate_of_university_partner_school',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })

    it('points should not add', () => {
      const checklist = checklistWithCriteria([
        universityOf({
          kind: 'top_ranked_university_graduate',
        }),
        universityOf({
          kind:
            'graduate_of_university_funded_by_top_global_universities_project',
        }),
        universityOf({
          kind: 'graduate_of_university_partner_school',
        }),
      ])

      const points = calculatePoints(checklist)

      expect(points).toBe(10)
    })
  })
})
