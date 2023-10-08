// write test cases for visa C
import { calculatePoints, errorMessages } from '@lib/domain'

import {
  academicBackgroundWith,
  annualSalaryOf,
  contractingOrganizationOf,
  japanese,
  professionalCareerWith,
  simulationWithCriteriaC,
  specialOf,
  universityOf,
  positionInCompany,
} from '@lib/spec.helper'

// non university holder business owner
// investment banker
describe('Visa type C point simulation', () => {
  describe('categories', () => {
    describe('academic background', () => {
      it('holder of multiple degrees in many areas', () => {
        const checklist = simulationWithCriteriaC([
          academicBackgroundWith({ degree: 'dual_degree' }),
          academicBackgroundWith({ degree: 'master' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(25)
        expect(matches.map(m => m.id).sort()).toEqual(['dual_degree', 'master'])
      })

      it('multiple degrees, should pick highest degree', () => {
        const checklist = simulationWithCriteriaC([
          academicBackgroundWith({ degree: 'master' }),
          academicBackgroundWith({ degree: 'bachelor' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(20)
        expect(matches.map(m => m.id).sort()).toEqual(['master'])
      })

      it('Single degree holder', () => {
        const checklist = simulationWithCriteriaC([
          academicBackgroundWith({ degree: 'bachelor' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual(['bachelor'])
      })
      it('two bachelor degree holder', () => {
        const checklist = simulationWithCriteriaC([
          academicBackgroundWith({ degree: 'bachelor' }),
          academicBackgroundWith({ degree: 'dual_degree' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual([
          'bachelor',
          'dual_degree',
        ])
      })
    })

    describe('professional career', () => {
      it('10 years of experience', () => {
        const checklist = simulationWithCriteriaC([
          professionalCareerWith({ yearsOfExperience: 10 }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(25)
        expect(matches.map(m => m.id).sort()).toEqual(['10_years_or_more'])
      })

      it('8_years_or_more', () => {
        const checklist = simulationWithCriteriaC([
          professionalCareerWith({ yearsOfExperience: 8 }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(20)
        expect(matches.map(m => m.id).sort()).toEqual(['7_years_or_more'])
      })

      it('6 years of experience', () => {
        const checklist = simulationWithCriteriaC([
          professionalCareerWith({ yearsOfExperience: 6 }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual(['5_years_or_more'])
      })

      it('4 years of experience', () => {
        const checklist = simulationWithCriteriaC([
          professionalCareerWith({ yearsOfExperience: 4 }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual(['3_years_or_more'])
      })

      it('1 year of experience', () => {
        const checklist = simulationWithCriteriaC([
          professionalCareerWith({ yearsOfExperience: 1 }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(0)
        expect(matches.map(m => m.id).sort()).toEqual([])
      })
    })

    describe('annual salary', () => {
      it('2.9 million', () => {
        const checklist = simulationWithCriteriaC([
          annualSalaryOf(2_999_999), // 0 points
        ])

        expect(() => {
          calculatePoints(checklist)
        }).toThrowError(errorMessages.salaryTooLow)
      })
      it('9.9 million', () => {
        const checklist = simulationWithCriteriaC([
          annualSalaryOf(9_999_999), // 0 points
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(0)
        expect(matches.map(m => m.id).sort()).toEqual([])
      })
      it('10 million', () => {
        const checklist = simulationWithCriteriaC([
          annualSalaryOf(10_000_000), // 10 points
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual(['10m_or_more'])
      })
      it('15 million', () => {
        const checklist = simulationWithCriteriaC([
          annualSalaryOf(15_000_000), // 20 points
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(20)
        expect(matches.map(m => m.id).sort()).toEqual(['15m_or_more'])
      })
      it('20 million', () => {
        const checklist = simulationWithCriteriaC([
          annualSalaryOf(20_000_000), // 30 points
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(30)
        expect(matches.map(m => m.id).sort()).toEqual(['20m_or_more'])
      })
      it('25 million', () => {
        const checklist = simulationWithCriteriaC([
          annualSalaryOf(25_000_000), // 40 points
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(40)
        expect(matches.map(m => m.id).sort()).toEqual(['25m_or_more'])
      })
      it('30 million', () => {
        const checklist = simulationWithCriteriaC([
          annualSalaryOf(30_000_000), // 50 points
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(50)
        expect(matches.map(m => m.id).sort()).toEqual(['30m_or_more'])
      })
    })

    describe('position in company', () => {
      it('representative director', () => {
        const checklist = simulationWithCriteriaC([
          positionInCompany({ kind: 'representative_director' }), // 10 points
        ])
        const { matches, points } = calculatePoints(checklist)
        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'representative_director',
        ])
      })
      it('executive officer', () => {
        const checklist = simulationWithCriteriaC([
          positionInCompany({ kind: 'executive_officer' }), // 5 points
        ])
        const { matches, points } = calculatePoints(checklist)
        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual(['executive_officer'])
      })
      it('executive officer and representative director should not be mutually exclusive', () => {
        const checklist = simulationWithCriteriaC([
          positionInCompany({ kind: 'executive_officer' }), // 5 points
          positionInCompany({ kind: 'representative_director' }), // 10 points
        ])
        const { matches, points } = calculatePoints(checklist)
        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual([
          'executive_officer',
          'representative_director',
        ])
      })
    })

    describe('special', () => {
      it('knows to ignore duplicates', () => {
        const checklist = simulationWithCriteriaC([
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
        const checklist = simulationWithCriteriaC([
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
        const checklist = simulationWithCriteriaC([
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
        const checklist = simulationWithCriteriaC([
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
        const checklist = simulationWithCriteriaC([
          contractingOrganizationOf({
            kind: 'contracting_organization_small_medium_sized',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(0)
        expect(matches.map(m => m.id).sort()).toEqual([])
      })
      it('promotes highly skilled professionals', () => {
        const checklist = simulationWithCriteriaC([
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
      it('research and development exceeds 3%', () => {
        const checklist = simulationWithCriteriaC([
          specialOf({ kind: 'rnd_exceeds_three_percent' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'rnd_exceeds_three_percent',
        ])
      })
      it('has foreign work related qualification', () => {
        const checklist = simulationWithCriteriaC([
          specialOf({ kind: 'foreign_work_related_qualification' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'foreign_work_related_qualification',
        ])
      })
      it('has worked on an advanced project in a growth field', () => {
        const checklist = simulationWithCriteriaC([
          specialOf({ kind: 'advanced_project_growth_field' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'advanced_project_growth_field',
        ])
      })
      it('completed training conducted by JICA as part of Innovative Asia Project', () => {
        const checklist = simulationWithCriteriaC([
          specialOf({
            kind: 'completed_training_conducted_by_jica_innovative_asia_project',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'completed_training_conducted_by_jica_innovative_asia_project',
        ])
      })
      it('invested over 100 million yen in an orginzation in japan', () => {
        const checklist = simulationWithCriteriaC([
          specialOf({ kind: 'invested_over_100_million_yen_in_japan' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'invested_over_100_million_yen_in_japan',
        ])
      })
      it('participates in investment business', () => {
        const checklist = simulationWithCriteriaC([
          specialOf({ kind: 'investment_management_business' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'investment_management_business',
        ])
      })

      it('qualifies for all special criteria', () => {
        const checklist = simulationWithCriteriaC([
          specialOf({ kind: 'rnd_exceeds_three_percent' }),
          specialOf({ kind: 'foreign_work_related_qualification' }),
          specialOf({ kind: 'advanced_project_growth_field' }),
          specialOf({
            kind: 'completed_training_conducted_by_jica_innovative_asia_project',
          }),
          specialOf({ kind: 'investment_management_business' }),
          specialOf({ kind: 'invested_over_100_million_yen_in_japan' }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(40)
        expect(matches.map(m => m.id).sort()).toEqual([
          'advanced_project_growth_field',
          'completed_training_conducted_by_jica_innovative_asia_project',
          'foreign_work_related_qualification',
          'invested_over_100_million_yen_in_japan',
          'investment_management_business',
          'rnd_exceeds_three_percent',
        ])
      })
    })
    describe('japanese ability', () => {
      it('knows to ignore duplicates', () => {
        const checklist = simulationWithCriteriaC([
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
        const checklist = simulationWithCriteriaC([
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
        const checklist = simulationWithCriteriaC([
          japanese({
            kind: 'jlpt_n1_or_equivalent',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual(['jlpt_n1_or_equivalent'])
      })

      it('has jlpt n2 or equivalent', () => {
        const checklist = simulationWithCriteriaC([
          japanese({
            kind: 'jlpt_n2_or_equivalent',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual(['jlpt_n2_or_equivalent'])
      })

      it('ignores jlpt n2 or equivalent if graduated from japanese university', () => {
        const checklist = simulationWithCriteriaC([
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
        const checklist = simulationWithCriteriaC([
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
        const checklist = simulationWithCriteriaC([
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
        const checklist = simulationWithCriteriaC([
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
        const checklist = simulationWithCriteriaC([
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
        const checklist = simulationWithCriteriaC([
          universityOf({
            kind: 'graduate_of_university_funded_by_top_global_universities_project',
          }),
        ])

        const { matches, points } = calculatePoints(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduate_of_university_funded_by_top_global_universities_project',
        ])
      })

      it('is designated partner school in the innovative asia project', () => {
        const checklist = simulationWithCriteriaC([
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
        const checklist = simulationWithCriteriaC([
          universityOf({
            kind: 'top_ranked_university_graduate',
          }),
          universityOf({
            kind: 'graduate_of_university_funded_by_top_global_universities_project',
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
})
