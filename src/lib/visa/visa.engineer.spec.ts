import {
  EngineerQualifications,
  calculatePoints,
} from '@lib/visa/visa.engineer'
import 'jest-extended'
import { errorMessages } from './errors'

type TestCase = [EngineerQualifications, number, string[]]

describe('point calculation: engineer visa', () => {
  const testCases: TestCase[] = [
    [{}, 0, []],

    // 学歴
    // academic background
    [{ degree: 'doctor' }, 30, ['doctor']],
    [{ degree: 'mba_mot' }, 25, ['mba_mot']],
    [{ degree: 'master' }, 20, ['master']],
    [{ degree: 'bachelor' }, 10, ['bachelor']],
    [{ degree: 'none' }, 0, []],
    [{ degree: 'master', dual_degree: true }, 25, ['dual_degree', 'master']],

    // 職歴
    // professional career
    [{ experience: 10 }, 20, ['10y_plus']],
    [{ experience: 7 }, 15, ['7y_plus']],
    [{ experience: 5 }, 10, ['5y_plus']],
    [{ experience: 3 }, 5, ['3y_plus']],
    [{ experience: 1 }, 0, []],

    // 年収
    // annual salary
    [{ salary: 12_500_000, age: 50 }, 40, ['10m_plus']],
    [{ salary: 9_999_999, age: 50 }, 35, ['9m_plus']],
    [{ salary: 5_000_000, age: 34 }, 25, ['5m_plus', 'under_35y']],
    [{ salary: 5_000_000, age: 35 }, 5, ['under_40y']],
    [{ salary: 3_000_000, age: 25 }, 15, ['under_30y']],

    // 年齢
    // age
    [{ age: 29 }, 15, ['under_30y']],
    [{ age: 34 }, 10, ['under_35y']],
    [{ age: 39 }, 5, ['under_40y']],
    [{ age: 40 }, 0, []],

    // 研究実績
    // research achievements
    [{ patent_inventor: true }, 15, ['patent_inventor']],
    [
      { conducted_financed_projects: true },
      15,
      ['conducted_financed_projects'],
    ],
    [{ published_papers: true }, 15, ['published_papers']],
    [{ recognized_research: true }, 15, ['recognized_research']],
    [
      {
        patent_inventor: true,
        conducted_financed_projects: true,
        published_papers: true,
        recognized_research: true,
      },
      15,
      [
        'patent_inventor',
        'conducted_financed_projects',
        'published_papers',
        'recognized_research',
      ],
    ],

    // 資格
    // license
    [{ certifications: 0 }, 0, []],
    [{ certifications: 1 }, 5, ['single_cert']],
    [{ certifications: 2 }, 10, ['many_certs']],

    // 特別加算: 契約機関
    // special additions: contracting organization
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

    // 特別加算（続き）
    // special additions (continued)
    [{ high_rnd_expenses: true }, 5, ['high_rnd_expenses']],
    [{ foreign_qualification: true }, 5, ['foreign_qualification']],
    [{ growth_field: true }, 10, ['growth_field']],
    [{ jp_uni_grad: true }, 10, ['jp_uni_grad']],

    // 特別加算（続き）: 日本語能力
    // special additions (continued): japanese ability
    [{ n1: true }, 15, ['n1']],
    [{ n2: true }, 10, ['n2']],
    [{ jp_uni_grad: true, n2: true }, 10, ['jp_uni_grad']],
    [{ n1: true, n2: true }, 15, ['n1']],
    [{ jp_uni_grad: true, n1: true }, 25, ['jp_uni_grad', 'n1']],

    // 特別加算（続き）: 大学
    // special additions (continued): university
    [{ uni_ranked: true }, 10, ['uni_ranked']],
    [{ uni_funded: true }, 10, ['uni_funded']],
    [{ uni_partner: true }, 10, ['uni_partner']],
    [
      { uni_ranked: true, uni_funded: true, uni_partner: true },
      10,
      ['uni_ranked', 'uni_funded', 'uni_partner'],
    ],

    // 特別加算（続き）
    // special additions (continued)
    [{ training_jica: true }, 5, ['training_jica']],
    [{ investment_management: true }, 10, ['investment_management']],

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
