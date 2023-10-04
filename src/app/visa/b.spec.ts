import { calculatePoints, errorMessages } from '@app/domain'
import {
  academicBackgroundWith,
  ageOf,
  annualSalaryOf,
  contractingOrganizationOf,
  japanese,
  licenseHolder,
  professionalCareerWith,
  researchAchievementOf,
  simulationWithCriteria,
  specialOf,
  universityOf,
} from '@app/spec.helper'

describe('Visa type B point simulation', () => {
  describe('categories', () => {
    describe('academic background', () => {
      it('single degree', () => {
        const checklist = simulationWithCriteria([
          academicBackgroundWith({ degree: 'doctor' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(30)
        expect(matches.map(m => m.id).sort()).toEqual(['doctor'])
      })

      it('multiple degrees, should pick highest degree', () => {
        const checklist = simulationWithCriteria([
          academicBackgroundWith({ degree: 'master' }),
          academicBackgroundWith({ degree: 'bachelor' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(20)
        expect(matches.map(m => m.id).sort()).toEqual(['master'])
      })

      it('a dual degree should give bonus', () => {
        const checklist = simulationWithCriteria([
          academicBackgroundWith({ degree: 'master' }),
          academicBackgroundWith({ degree: 'bachelor' }),
          academicBackgroundWith({ degree: 'dual_degree' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(25)
        expect(matches.map(m => m.id).sort()).toEqual(['dual_degree', 'master'])
      })
    })

    describe('professional career', () => {
      it('10 years of experience', () => {
        const checklist = simulationWithCriteria([
          professionalCareerWith({ yearsOfExperience: 15 }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(20)
        expect(matches.map(m => m.id).sort()).toEqual(['10_years_or_more'])
      })

      it('4 years of experience', () => {
        const checklist = simulationWithCriteria([
          professionalCareerWith({ yearsOfExperience: 4 }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual(['3_years_or_more'])
      })

      it('1 year of experience', () => {
        const checklist = simulationWithCriteria([
          professionalCareerWith({ yearsOfExperience: 1 }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(0)
        expect(matches.map(m => m.id).sort()).toEqual([])
      })
    })

    describe('annual salary', () => {
      it('12,500,000 JPY @ 50 years old', () => {
        const checklist = simulationWithCriteria([
          annualSalaryOf(12_500_000),
          ageOf(50),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(40)
        expect(matches.map(m => m.id).sort()).toEqual(['10m_or_more'])
      })

      it('9,999,999 JPY @ 50 years old', () => {
        const checklist = simulationWithCriteria([
          annualSalaryOf(9_999_999),
          ageOf(50),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(35)
        expect(matches.map(m => m.id).sort()).toEqual(['9m_or_more'])
      })

      it('5,000,000 JPY @ 34 years old', () => {
        const checklist = simulationWithCriteria([
          annualSalaryOf(5_000_000), // 15 points
          ageOf(34), // 10 points
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(25)
        expect(matches.map(m => m.id).sort()).toEqual([
          '5m_or_more',
          'less_than_35',
        ])
      })

      it('5,000,000 JPY @ 35 years old', () => {
        const checklist = simulationWithCriteria([
          annualSalaryOf(5_000_000), // 0 points
          ageOf(35), // 5 points
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual(['less_than_40'])
      })

      it('3,000,000 JPY @ 20 years old', () => {
        const checklist = simulationWithCriteria([
          annualSalaryOf(3_000_000), // 0 points
          ageOf(20), // 15 points
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual(['less_than_30'])
      })

      it('2,999,999 JPY @ 24 years old', () => {
        const checklist = simulationWithCriteria([
          annualSalaryOf(2_999_999),
          ageOf(24),
        ])

        expect(() => {
          calculatePoints(checklist)
        }).toThrowError(errorMessages.salaryTooLow)
      })
    })

    describe('age', () => {
      it('29 years old', () => {
        const checklist = simulationWithCriteria([ageOf(29)])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual(['less_than_30'])
      })

      it('34 years old', () => {
        const checklist = simulationWithCriteria([ageOf(34)])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual(['less_than_35'])
      })

      it('35 years old', () => {
        const checklist = simulationWithCriteria([ageOf(35)])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual(['less_than_40'])
      })

      it('40 years old', () => {
        const checklist = simulationWithCriteria([ageOf(40)])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(0)
        expect(matches.map(m => m.id).sort()).toEqual([])
      })
    })

    describe('research achievements', () => {
      it('have at least one patent', () => {
        const checklist = simulationWithCriteria([
          researchAchievementOf({ kind: 'patent_inventor' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual(['patent_inventor'])
      })

      it('conducted financed projects', () => {
        const checklist = simulationWithCriteria([
          researchAchievementOf({ kind: 'conducted_financed_projects_three_times' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual([
          'conducted_financed_projects_three_times',
        ])
      })

      it('has published three or more papers', () => {
        const checklist = simulationWithCriteria([
          researchAchievementOf({ kind: 'has_published_three_papers' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual([
          'has_published_three_papers',
        ])
      })

      it('research is recognized by japan', () => {
        const checklist = simulationWithCriteria([
          researchAchievementOf({ kind: 'research_recognized_by_japan' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual([
          'research_recognized_by_japan',
        ])
      })

      it('having multiple research achievements should count as one', () => {
        const checklist = simulationWithCriteria([
          researchAchievementOf({ kind: 'patent_inventor' }),
          researchAchievementOf({ kind: 'has_published_three_papers' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual([
          'has_published_three_papers',
          'patent_inventor',
        ])
      })
    })

    describe('national licenses', () => {
      it('has three national licenses', () => {
        const checklist = simulationWithCriteria([licenseHolder({ count: 3 })])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'has_two_or_more_national_license',
        ])
      })

      it('has two national licenses', () => {
        const checklist = simulationWithCriteria([licenseHolder({ count: 2 })])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'has_two_or_more_national_license',
        ])
      })

      it('has one national license', () => {
        const checklist = simulationWithCriteria([licenseHolder({ count: 1 })])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'has_one_national_license',
        ])
      })

      it('has no national licenses', () => {
        const checklist = simulationWithCriteria([licenseHolder({ count: 0 })])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(0)
        expect(matches.map(m => m.id).sort()).toEqual([])
      })
    })

    describe('special', () => {
      it('knows to ignore duplicates', () => {
        const checklist = simulationWithCriteria([
          specialOf({ kind: 'rnd_exceeds_three_percent' }),
          specialOf({ kind: 'rnd_exceeds_three_percent' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'rnd_exceeds_three_percent',
        ])
      })

      it('research and development exceeds 3%', () => {
        const checklist = simulationWithCriteria([
          specialOf({ kind: 'rnd_exceeds_three_percent' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'rnd_exceeds_three_percent',
        ])
      })

      it('has foreign work related qualification', () => {
        const checklist = simulationWithCriteria([
          specialOf({ kind: 'foreign_work_related_qualification' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'foreign_work_related_qualification',
        ])
      })

      it('has worked on an advanced project in a growth field', () => {
        const checklist = simulationWithCriteria([
          specialOf({ kind: 'advanced_project_growth_field' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'advanced_project_growth_field',
        ])
      })

      it('completed training conducted by JICA as part of Innovative Asia Project', () => {
        const checklist = simulationWithCriteria([
          specialOf({
            kind:
              'completed_training_conducted_by_jica_innovative_asia_project',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'completed_training_conducted_by_jica_innovative_asia_project',
        ])
      })

      it('qualifies for all special criteria', () => {
        const checklist = simulationWithCriteria([
          specialOf({ kind: 'rnd_exceeds_three_percent' }),
          specialOf({ kind: 'foreign_work_related_qualification' }),
          specialOf({ kind: 'advanced_project_growth_field' }),
          specialOf({
            kind:
              'completed_training_conducted_by_jica_innovative_asia_project',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(25)
        expect(matches.map(m => m.id).sort()).toEqual([
          'advanced_project_growth_field',
          'completed_training_conducted_by_jica_innovative_asia_project',
          'foreign_work_related_qualification',
          'rnd_exceeds_three_percent',
        ])
      })
    })

    describe('contracting organization', () => {
      it('knows to ignore duplicates', () => {
        const checklist = simulationWithCriteria([
          contractingOrganizationOf({
            kind: 'contracting_organization_promotes_highly_skilled',
          }),
          contractingOrganizationOf({
            kind: 'contracting_organization_promotes_highly_skilled',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'contracting_organization_promotes_highly_skilled',
        ])
      })

      it('promotes innovation', () => {
        const checklist = simulationWithCriteria([
          contractingOrganizationOf({
            kind: 'contracting_organization_promotes_innovation',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'contracting_organization_promotes_innovation',
        ])
      })

      it('promotes innovation & small-medium sized company', () => {
        const checklist = simulationWithCriteria([
          contractingOrganizationOf({
            kind: 'contracting_organization_promotes_innovation',
          }),
          contractingOrganizationOf({
            kind: 'contracting_organization_small_medium_sized',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(20)
        expect(matches.map(m => m.id).sort()).toEqual([
          'contracting_organization_promotes_innovation',
          'contracting_organization_small_medium_sized',
        ])
      })

      it('promotes highly skilled professionals & innovation & small-medium sized company', () => {
        const checklist = simulationWithCriteria([
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

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(30)
        expect(matches.map(m => m.id).sort()).toEqual([
          'contracting_organization_promotes_highly_skilled',
          'contracting_organization_promotes_innovation',
          'contracting_organization_small_medium_sized',
        ])
      })

      it('ignores small-medium sized company when not promoting innovation', () => {
        const checklist = simulationWithCriteria([
          contractingOrganizationOf({
            kind: 'contracting_organization_small_medium_sized',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(0)
        expect(matches.map(m => m.id).sort()).toEqual([])
      })

      it('promotes highly skilled professionals', () => {
        const checklist = simulationWithCriteria([
          contractingOrganizationOf({
            kind: 'contracting_organization_promotes_highly_skilled',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'contracting_organization_promotes_highly_skilled',
        ])
      })
    })

    describe('japanese ability', () => {
      it('knows to ignore duplicates', () => {
        const checklist = simulationWithCriteria([
          japanese({
            kind: 'graduated_japanese_uni_or_course',
          }),
          japanese({
            kind: 'graduated_japanese_uni_or_course',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduated_japanese_uni_or_course',
        ])
      })

      it('graduated japanese university', () => {
        const checklist = simulationWithCriteria([
          japanese({
            kind: 'graduated_japanese_uni_or_course',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduated_japanese_uni_or_course',
        ])
      })

      it('has jlpt n1 or equivalent', () => {
        const checklist = simulationWithCriteria([
          japanese({
            kind: 'jlpt_n1_or_equivalent',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual(['jlpt_n1_or_equivalent'])
      })

      it('has jlpt n2 or equivalent', () => {
        const checklist = simulationWithCriteria([
          japanese({
            kind: 'jlpt_n2_or_equivalent',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual(['jlpt_n2_or_equivalent'])
      })

      it('ignores jlpt n2 or equivalent if graduated from japanese university', () => {
        const checklist = simulationWithCriteria([
          japanese({
            kind: 'jlpt_n2_or_equivalent',
          }),
          japanese({
            kind: 'graduated_japanese_uni_or_course',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduated_japanese_uni_or_course',
        ])
      })

      it('ignores jlpt n2 or equivalent when having n1', () => {
        const checklist = simulationWithCriteria([
          japanese({
            kind: 'jlpt_n2_or_equivalent',
          }),
          japanese({
            kind: 'jlpt_n1_or_equivalent',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual(['jlpt_n1_or_equivalent'])
      })

      it('has jlpt n1 or equivalent and graduated from japanese university', () => {
        const checklist = simulationWithCriteria([
          japanese({
            kind: 'jlpt_n1_or_equivalent',
          }),
          japanese({
            kind: 'graduated_japanese_uni_or_course',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(25)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduated_japanese_uni_or_course',
          'jlpt_n1_or_equivalent',
        ])
      })
    })

    describe('university', () => {
      it('knows to ignore duplicates', () => {
        const checklist = simulationWithCriteria([
          universityOf({
            kind: 'top_ranked_university_graduate',
          }),
          universityOf({
            kind: 'top_ranked_university_graduate',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'top_ranked_university_graduate',
        ])
      })

      it('is a top 300 university', () => {
        const checklist = simulationWithCriteria([
          universityOf({
            kind: 'top_ranked_university_graduate',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'top_ranked_university_graduate',
        ])
      })

      it('is funded by top global universities project', () => {
        const checklist = simulationWithCriteria([
          universityOf({
            kind:
              'graduate_of_university_funded_by_top_global_universities_project',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduate_of_university_funded_by_top_global_universities_project',
        ])
      })

      it('is designated partner school in the innovative asia project', () => {
        const checklist = simulationWithCriteria([
          universityOf({
            kind: 'graduate_of_university_partner_school',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduate_of_university_partner_school',
        ])
      })

      it('points should not add', () => {
        const checklist = simulationWithCriteria([
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

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduate_of_university_funded_by_top_global_universities_project',
          'graduate_of_university_partner_school',
          'top_ranked_university_graduate',
        ])
      })
    })
  })

  describe('case #1: Google engineer', () => {
    it('points should add up', () => {
      const checklist = simulationWithCriteria([
        academicBackgroundWith({ degree: 'master' }),
        professionalCareerWith({ yearsOfExperience: 6 }),
        annualSalaryOf(25_000_000),
        ageOf(30),
        japanese({ kind: 'graduated_japanese_uni_or_course' }),
        universityOf({
          kind: 'top_ranked_university_graduate',
        }),
      ])

      const { matches, points } = calculatePoints(checklist)

      expect(points).toBe(100)
      expect(matches.map(m => m.id).sort()).toEqual([
        '10m_or_more',
        '5_years_or_more',
        'graduated_japanese_uni_or_course',
        'less_than_35',
        'master',
        'top_ranked_university_graduate',
      ])
    })
  })

  describe('case #2: self-taught engineer at a startup', () => {
    it('points should add up', () => {
      const checklist = simulationWithCriteria([
        professionalCareerWith({ yearsOfExperience: 3 }),
        annualSalaryOf(7_000_000),
        ageOf(27),
        licenseHolder({ count: 2 }),
        japanese({ kind: 'jlpt_n1_or_equivalent' }),
      ])

      const { matches, points } = calculatePoints(checklist)

      expect(points).toBe(70)
      expect(matches.map(m => m.id).sort()).toEqual([
        '3_years_or_more',
        '7m_or_more',
        'has_two_or_more_national_license',
        'jlpt_n1_or_equivalent',
        'less_than_30',
      ])
    })
  })

  describe('case #3: experienced ML engineer', () => {
    it('points should add up', () => {
      const checklist = simulationWithCriteria([
        academicBackgroundWith({ degree: 'doctor' }),
        professionalCareerWith({ yearsOfExperience: 10 }),
        annualSalaryOf(15_000_000),
        ageOf(50),
        researchAchievementOf({ kind: 'patent_inventor' }),
        researchAchievementOf({ kind: 'has_published_three_papers' }),
      ])

      const { matches, points } = calculatePoints(checklist)

      expect(points).toBe(105)
      expect(matches.map(m => m.id).sort()).toEqual([
        '10_years_or_more',
        '10m_or_more',
        'doctor',
        'has_published_three_papers',
        'patent_inventor',
      ])
    })
  })

  describe('case #4: experienced product manager', () => {
    it('points should add up', () => {
      const checklist = simulationWithCriteria([
        academicBackgroundWith({ degree: 'business_management' }),
        academicBackgroundWith({ degree: 'master' }),
        professionalCareerWith({ yearsOfExperience: 5 }),
        annualSalaryOf(14_000_000),
        ageOf(34),
        contractingOrganizationOf({
          kind: 'contracting_organization_promotes_innovation',
        }),
        contractingOrganizationOf({
          kind: 'contracting_organization_small_medium_sized',
        }),
        japanese({ kind: 'graduated_japanese_uni_or_course' }),
        japanese({ kind: 'jlpt_n1_or_equivalent' }),
      ])

      const { matches, points } = calculatePoints(checklist)

      expect(points).toBe(130)
      expect(matches.map(m => m.id).sort()).toEqual([
        '10m_or_more',
        '5_years_or_more',
        'business_management',
        'contracting_organization_promotes_innovation',
        'contracting_organization_small_medium_sized',
        'graduated_japanese_uni_or_course',
        'jlpt_n1_or_equivalent',
        'less_than_35',
      ])
    })
  })
  describe('Case #5: non University Degree holder Innovator', () => {
    it('points should add up', () => {
      const checklist = simulationWithCriteria([
        professionalCareerWith({ yearsOfExperience: 10 }), //20
        annualSalaryOf(20_000_000), // 40
        ageOf(25), // 15
        researchAchievementOf({ kind: 'patent_inventor' }), // 15
        contractingOrganizationOf({
          kind: 'contracting_organization_promotes_innovation', // 10
        }),
        contractingOrganizationOf({
          kind: 'contracting_organization_small_medium_sized', //10
        }),
      ])

      const { matches, points } = calculatePoints(checklist)

      expect(points).toBe(110)
      expect(matches.map(m => m.id).sort()).toEqual([
        '10_years_or_more',
        '10m_or_more',
        'contracting_organization_promotes_innovation',
        'contracting_organization_small_medium_sized',
        'less_than_30',
        'patent_inventor',
      ])
    })
  })
})
