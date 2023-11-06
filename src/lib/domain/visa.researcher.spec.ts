import {
  ResearcherQualifications,
  calculatePoints,
} from '@lib/domain/visa.researcher'
import 'jest-extended'
import { errorMessages } from './errors'

type TestCase = [ResearcherQualifications, number, string[]]

describe('point calculation: researcher visa', () => {
  const testCases: TestCase[] = [
    [{}, 0, []],

    // degrees
    [{ degree: 'doctor' }, 30, ['doctor']],
    [{ degree: 'master' }, 20, ['master']],
    [{ degree: 'bachelor' }, 10, ['bachelor']],
    [{ degree: 'none' }, 0, []],
    [{ degree: 'master', dual_degree: true }, 25, ['dual_degree', 'master']],

    // professional career
    [{ experience: 7 }, 15, ['7y_plus']],
    [{ experience: 5 }, 10, ['5y_plus']],
    [{ experience: 3 }, 5, ['3y_plus']],
    [{ experience: 1 }, 0, []],

    // salary
    [{ salary: 12_500_000, age: 50 }, 40, ['10m_plus']],
    [{ salary: 9_999_999, age: 50 }, 35, ['9m_plus']],
    [{ salary: 5_000_000, age: 34 }, 25, ['5m_plus', 'under_35y']],
    [{ salary: 5_000_000, age: 35 }, 5, ['under_40y']],
    [{ salary: 3_000_000, age: 25 }, 15, ['under_30y']],

    // age
    [{ age: 29 }, 15, ['under_30y']],
    [{ age: 34 }, 10, ['under_35y']],
    [{ age: 39 }, 5, ['under_40y']],
    [{ age: 40 }, 0, []],

    // research achievements
    [{ patent_inventor: true }, 20, ['patent_inventor']],
    [
      { conducted_financed_projects: true },
      20,
      ['conducted_financed_projects'],
    ],
    [{ published_papers: true }, 20, ['published_papers']],
    [{ recognized_research: true }, 20, ['recognized_research']],
    [
      {
        patent_inventor: true,
        conducted_financed_projects: true,
        published_papers: true,
        recognized_research: true,
      },
      25,
      [
        'patent_inventor',
        'conducted_financed_projects',
        'published_papers',
        'recognized_research',
      ],
    ],

    // bonus
    [{ high_rnd_expenses: true }, 0, []],
    [{ high_rnd_expenses: true, org_smb: true }, 5, ['high_rnd_expenses']],
    [{ foreign_qualification: true }, 5, ['foreign_qualification']],
    [{ growth_field: true }, 10, ['growth_field']],
    [{ training_jica: true }, 5, ['training_jica']],
    [
      {
        high_rnd_expenses: true,
        org_smb: true,
        foreign_qualification: true,
        growth_field: true,
        training_jica: true,
      },
      25,
      [
        'high_rnd_expenses',
        'foreign_qualification',
        'growth_field',
        'training_jica',
      ],
    ],

    // contracting organization
    [{ org_promotes_innovation: true }, 10, ['org_promotes_innovation']],
    [
      { org_promotes_innovation: true, org_smb: true },
      20,
      ['org_promotes_innovation', 'org_smb'],
    ],
    [
      {
        org_promotes_innovation: true,
        org_smb: true,
        org_promotes_highly_skilled: true,
      },
      30,
      ['org_promotes_innovation', 'org_smb', 'org_promotes_highly_skilled'],
    ],
    [{ org_smb: true }, 0, []],
    [
      { org_promotes_highly_skilled: true },
      10,
      ['org_promotes_highly_skilled'],
    ],

    // japanese ability
    [{ jp_uni_grad: true }, 10, ['jp_uni_grad']],
    [{ jp: 'jp_major' }, 15, ['jp_major']],
    [{ jp: 'n1' }, 15, ['n1']],
    [{ jp: 'n2' }, 10, ['n2']],
    [{ jp_uni_grad: true, jp: 'n2' }, 10, ['jp_uni_grad']],
    [{ jp_uni_grad: true, jp: 'n1' }, 25, ['jp_uni_grad', 'n1']],
    [{ jp_uni_grad: true, jp: 'jp_major' }, 25, ['jp_uni_grad', 'jp_major']],

    // university
    [{ uni_ranked: true }, 10, ['uni_ranked']],
    [{ uni_funded: true }, 10, ['uni_funded']],
    [{ uni_partner: true }, 10, ['uni_partner']],
    [
      { uni_ranked: true, uni_funded: true, uni_partner: true },
      10,
      ['uni_ranked', 'uni_funded', 'uni_partner'],
    ],

    // TODO: test real cases
  ]

  test.each(testCases)(
    'calculate(%p) == %p points',
    (q, expectedPoints, expectedIds) => {
      const { matches, points } = calculatePoints(q)

      expect(matches.map(it => it.id)).toIncludeSameMembers(expectedIds)
      expect(points).toBe(expectedPoints)
    },
  )

  test('calculate({ salary: 2999999}) throws error', () => {
    expect(() => {
      calculatePoints({ salary: 2_999_999, age: 24 })
    }).toThrowError(errorMessages.salaryTooLow)
  })
})
