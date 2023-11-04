import {
  BusinessManagerQualifications,
  calculatePoints,
} from '@lib/domain/visa.businessmanager'
import 'jest-extended'
import { errorMessages } from './errors'

type TestCase = [BusinessManagerQualifications, number, string[]]

describe('point calculation: business management visa', () => {
  const testCases: TestCase[] = [
    [{}, 0, []],

    // 学歴
    // academic background
    [{ degree: 'mba_mot' }, 25, ['mba_mot']],
    [{ degree: 'doctor' }, 20, ['doctor']],
    [{ degree: 'master' }, 20, ['master']],
    [{ degree: 'bachelor' }, 10, ['bachelor']],
    [{ degree: 'none' }, 0, []],
    [{ degree: 'master', dual_degree: true }, 25, ['dual_degree', 'master']],

    // 職歴
    // professional career
    [{ experience: 10 }, 25, ['10y_plus']],
    [{ experience: 7 }, 20, ['7y_plus']],
    [{ experience: 5 }, 15, ['5y_plus']],
    [{ experience: 3 }, 10, ['3y_plus']],
    [{ experience: 1 }, 0, []],

    // 年収
    // annual salary
    [{ salary: 30_000_000 }, 50, ['30m_plus']],
    [{ salary: 25_000_000 }, 40, ['25m_plus']],
    [{ salary: 20_000_000 }, 30, ['20m_plus']],
    [{ salary: 15_000_000 }, 20, ['15m_plus']],
    [{ salary: 10_000_000 }, 10, ['10m_plus']],
    [{ salary: 3_000_000 }, 0, []],

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

    // 特別加算
    // special additions
    [{ high_rnd_expenses: true }, 5, ['high_rnd_expenses']],
    [{ foreign_qualification: true }, 5, ['foreign_qualification']],
    [{ growth_field: true }, 10, ['growth_field']],
    [{ jp_uni_grad: true }, 10, ['jp_uni_grad']],

    // 特別加算（続き）: 日本語能力
    // special additions (continued): japanese ability
    [{ jp: 'n1' }, 15, ['n1']],
    [{ jp: 'n2' }, 10, ['n2']],
    [{ jp_uni_grad: true, jp: 'n2' }, 10, ['jp_uni_grad']],
    [{ jp_uni_grad: true, jp: 'n1' }, 25, ['jp_uni_grad', 'n1']],

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
    [{ high_investment: true }, 5, ['high_investment']],
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
      calculatePoints({ salary: 2_999_999 })
    }).toThrowError(errorMessages.salaryTooLow)
  })
})
