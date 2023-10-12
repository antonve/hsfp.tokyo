import { calculatePointsForVisaA } from '@lib/visa/a'
import { errorMessages } from '@lib/visa/errors'
import {
  academicBackgroundWith,
  ageOf,
  annualSalaryOf,
  contractingOrganizationOf,
  japanese,
  professionalCareerWith,
  researchAchievementOf,
  specialOf,
  universityOf,
} from '@lib/domain/qualifications'

describe('Visa type A point simulation', () => {
  describe('categories', () => {
    describe('academic background', () => {
      it('single degree', () => {
        const checklist = [academicBackgroundWith({ degree: 'doctor' })]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(30)
        expect(matches.map(m => m.id).sort()).toEqual(['doctor'])
      })

      it('multiple degrees, should pick highest degree', () => {
        const checklist = [
          academicBackgroundWith({ degree: 'master' }),
          academicBackgroundWith({ degree: 'bachelor' }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(20)
        expect(matches.map(m => m.id).sort()).toEqual(['master'])
      })

      it('a dual degree should give bonus', () => {
        const checklist = [
          academicBackgroundWith({ degree: 'master' }),
          academicBackgroundWith({ degree: 'bachelor' }),
          academicBackgroundWith({ degree: 'dual_degree' }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(25)
        expect(matches.map(m => m.id).sort()).toEqual(['dual_degree', 'master'])
      })
    })

    describe('professional career', () => {
      it('8 years of experience', () => {
        const checklist = [professionalCareerWith({ yearsOfExperience: 8 })]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual(['7_years_or_more'])
      })
      it('6 years of experience', () => {
        const checklist = [professionalCareerWith({ yearsOfExperience: 6 })]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual(['5_years_or_more'])
      })

      it('4 years of experience', () => {
        const checklist = [professionalCareerWith({ yearsOfExperience: 4 })]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual(['3_years_or_more'])
      })

      it('1 year of experience', () => {
        const checklist = [professionalCareerWith({ yearsOfExperience: 1 })]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(0)
        expect(matches.map(m => m.id).sort()).toEqual([])
      })
    })

    describe('annual salary', () => {
      it('12,500,000 JPY @ 50 years old', () => {
        const checklist = [annualSalaryOf(12_500_000), ageOf(50)]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(40)
        expect(matches.map(m => m.id).sort()).toEqual(['10m_or_more'])
      })

      it('9,999,999 JPY @ 50 years old', () => {
        const checklist = [annualSalaryOf(9_999_999), ageOf(50)]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(35)
        expect(matches.map(m => m.id).sort()).toEqual(['9m_or_more'])
      })

      it('5,000,000 JPY @ 34 years old', () => {
        const checklist = [
          annualSalaryOf(5_000_000), // 15 points
          ageOf(34), // 10 points
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(25)
        expect(matches.map(m => m.id).sort()).toEqual([
          '5m_or_more',
          'less_than_35',
        ])
      })

      it('5,000,000 JPY @ 35 years old', () => {
        const checklist = [
          annualSalaryOf(5_000_000), // 0 points
          ageOf(35), // 5 points
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual(['less_than_40'])
      })

      it('3,000,000 JPY @ 20 years old', () => {
        const checklist = [
          annualSalaryOf(3_000_000), // 0 points
          ageOf(20), // 15 points
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual(['less_than_30'])
      })

      it('2,999,999 JPY @ 24 years old', () => {
        const checklist = [annualSalaryOf(2_999_999), ageOf(24)]

        expect(() => {
          calculatePointsForVisaA(checklist)
        }).toThrowError(errorMessages.salaryTooLow)
      })
    })

    describe('age', () => {
      it('29 years old', () => {
        const checklist = [ageOf(29)]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual(['less_than_30'])
      })

      it('34 years old', () => {
        const checklist = [ageOf(34)]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual(['less_than_35'])
      })

      it('35 years old', () => {
        const checklist = [ageOf(35)]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual(['less_than_40'])
      })

      it('40 years old', () => {
        const checklist = [ageOf(40)]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(0)
        expect(matches.map(m => m.id).sort()).toEqual([])
      })
    })

    describe('research achievements', () => {
      it('have at least one patent', () => {
        const checklist = [researchAchievementOf({ kind: 'patent_inventor' })]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(20)
        expect(matches.map(m => m.id).sort()).toEqual(['patent_inventor'])
      })

      it('conducted financed projects', () => {
        const checklist = [
          researchAchievementOf({
            kind: 'conducted_financed_projects_three_times',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(20)
        expect(matches.map(m => m.id).sort()).toEqual([
          'conducted_financed_projects_three_times',
        ])
      })

      it('has published three or more papers', () => {
        const checklist = [
          researchAchievementOf({ kind: 'has_published_three_papers' }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(20)
        expect(matches.map(m => m.id).sort()).toEqual([
          'has_published_three_papers',
        ])
      })

      it('research is recognized by japan', () => {
        const checklist = [
          researchAchievementOf({ kind: 'research_recognized_by_japan' }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(20)
        expect(matches.map(m => m.id).sort()).toEqual([
          'research_recognized_by_japan',
        ])
      })

      it('2 achievements should result in bonus point', () => {
        const checklist = [
          researchAchievementOf({ kind: 'has_published_three_papers' }),
          researchAchievementOf({ kind: 'research_recognized_by_japan' }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(25)
        expect(matches.map(m => m.id).sort()).toEqual([
          'has_published_three_papers',
          'research_recognized_by_japan',
        ])
      })

      it('3 achievements should result in adding only bonus point', () => {
        const checklist = [
          researchAchievementOf({ kind: 'has_published_three_papers' }),
          researchAchievementOf({ kind: 'research_recognized_by_japan' }),
          researchAchievementOf({
            kind: 'conducted_financed_projects_three_times',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(25)
        expect(matches.map(m => m.id).sort()).toEqual([
          'conducted_financed_projects_three_times',
          'has_published_three_papers',
          'research_recognized_by_japan',
        ])
      })
    })

    describe('special', () => {
      it('knows to ignore duplicates', () => {
        const checklist = [
          specialOf({ kind: 'rnd_exceeds_three_percent' }),
          specialOf({ kind: 'rnd_exceeds_three_percent' }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'rnd_exceeds_three_percent',
        ])
      })

      it('research and development exceeds 3%', () => {
        const checklist = [specialOf({ kind: 'rnd_exceeds_three_percent' })]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'rnd_exceeds_three_percent',
        ])
      })

      it('has foreign work related qualification', () => {
        const checklist = [
          specialOf({ kind: 'foreign_work_related_qualification' }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'foreign_work_related_qualification',
        ])
      })

      it('has worked on an advanced project in a growth field', () => {
        const checklist = [specialOf({ kind: 'advanced_project_growth_field' })]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'advanced_project_growth_field',
        ])
      })

      it('completed training conducted by JICA as part of Innovative Asia Project', () => {
        const checklist = [
          specialOf({
            kind: 'completed_training_conducted_by_jica_innovative_asia_project',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(5)
        expect(matches.map(m => m.id).sort()).toEqual([
          'completed_training_conducted_by_jica_innovative_asia_project',
        ])
      })

      it('qualifies for all special criteria', () => {
        const checklist = [
          specialOf({ kind: 'rnd_exceeds_three_percent' }),
          specialOf({ kind: 'foreign_work_related_qualification' }),
          specialOf({ kind: 'advanced_project_growth_field' }),
          specialOf({
            kind: 'completed_training_conducted_by_jica_innovative_asia_project',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

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
        const checklist = [
          contractingOrganizationOf({
            kind: 'contracting_organization_promotes_highly_skilled',
          }),
          contractingOrganizationOf({
            kind: 'contracting_organization_promotes_highly_skilled',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'contracting_organization_promotes_highly_skilled',
        ])
      })

      it('promotes innovation', () => {
        const checklist = [
          contractingOrganizationOf({
            kind: 'contracting_organization_promotes_innovation',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'contracting_organization_promotes_innovation',
        ])
      })

      it('promotes innovation & small-medium sized company', () => {
        const checklist = [
          contractingOrganizationOf({
            kind: 'contracting_organization_promotes_innovation',
          }),
          contractingOrganizationOf({
            kind: 'contracting_organization_small_medium_sized',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(20)
        expect(matches.map(m => m.id).sort()).toEqual([
          'contracting_organization_promotes_innovation',
          'contracting_organization_small_medium_sized',
        ])
      })

      it('promotes highly skilled professionals & innovation & small-medium sized company', () => {
        const checklist = [
          contractingOrganizationOf({
            kind: 'contracting_organization_promotes_innovation',
          }),
          contractingOrganizationOf({
            kind: 'contracting_organization_small_medium_sized',
          }),
          contractingOrganizationOf({
            kind: 'contracting_organization_promotes_highly_skilled',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(30)
        expect(matches.map(m => m.id).sort()).toEqual([
          'contracting_organization_promotes_highly_skilled',
          'contracting_organization_promotes_innovation',
          'contracting_organization_small_medium_sized',
        ])
      })

      it('ignores small-medium sized company when not promoting innovation', () => {
        const checklist = [
          contractingOrganizationOf({
            kind: 'contracting_organization_small_medium_sized',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(0)
        expect(matches.map(m => m.id).sort()).toEqual([])
      })

      it('promotes highly skilled professionals', () => {
        const checklist = [
          contractingOrganizationOf({
            kind: 'contracting_organization_promotes_highly_skilled',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'contracting_organization_promotes_highly_skilled',
        ])
      })
    })

    describe('japanese ability', () => {
      it('knows to ignore duplicates', () => {
        const checklist = [
          japanese({
            kind: 'graduated_japanese_uni_or_course',
          }),
          japanese({
            kind: 'graduated_japanese_uni_or_course',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduated_japanese_uni_or_course',
        ])
      })

      it('graduated japanese university', () => {
        const checklist = [
          japanese({
            kind: 'graduated_japanese_uni_or_course',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduated_japanese_uni_or_course',
        ])
      })

      it('has jlpt n1 or equivalent', () => {
        const checklist = [
          japanese({
            kind: 'jlpt_n1_or_equivalent',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual(['jlpt_n1_or_equivalent'])
      })

      it('has jlpt n2 or equivalent', () => {
        const checklist = [
          japanese({
            kind: 'jlpt_n2_or_equivalent',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual(['jlpt_n2_or_equivalent'])
      })

      it('ignores jlpt n2 or equivalent if graduated from japanese university', () => {
        const checklist = [
          japanese({
            kind: 'jlpt_n2_or_equivalent',
          }),
          japanese({
            kind: 'graduated_japanese_uni_or_course',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduated_japanese_uni_or_course',
        ])
      })

      it('ignores jlpt n2 or equivalent when having n1', () => {
        const checklist = [
          japanese({
            kind: 'jlpt_n2_or_equivalent',
          }),
          japanese({
            kind: 'jlpt_n1_or_equivalent',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(15)
        expect(matches.map(m => m.id).sort()).toEqual(['jlpt_n1_or_equivalent'])
      })

      it('has jlpt n1 or equivalent and graduated from japanese university', () => {
        const checklist = [
          japanese({
            kind: 'jlpt_n1_or_equivalent',
          }),
          japanese({
            kind: 'graduated_japanese_uni_or_course',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(25)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduated_japanese_uni_or_course',
          'jlpt_n1_or_equivalent',
        ])
      })
    })

    describe('university', () => {
      it('knows to ignore duplicates', () => {
        const checklist = [
          universityOf({
            kind: 'top_ranked_university_graduate',
          }),
          universityOf({
            kind: 'top_ranked_university_graduate',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'top_ranked_university_graduate',
        ])
      })

      it('is a top 300 university', () => {
        const checklist = [
          universityOf({
            kind: 'top_ranked_university_graduate',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'top_ranked_university_graduate',
        ])
      })

      it('is funded by top global universities project', () => {
        const checklist = [
          universityOf({
            kind: 'graduate_of_university_funded_by_top_global_universities_project',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduate_of_university_funded_by_top_global_universities_project',
        ])
      })

      it('is designated partner school in the innovative asia project', () => {
        const checklist = [
          universityOf({
            kind: 'graduate_of_university_partner_school',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

        expect(points).toBe(10)
        expect(matches.map(m => m.id).sort()).toEqual([
          'graduate_of_university_partner_school',
        ])
      })

      it('points should not add', () => {
        const checklist = [
          universityOf({
            kind: 'top_ranked_university_graduate',
          }),
          universityOf({
            kind: 'graduate_of_university_funded_by_top_global_universities_project',
          }),
          universityOf({
            kind: 'graduate_of_university_partner_school',
          }),
        ]

        const { matches, points } = calculatePointsForVisaA(checklist)

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
