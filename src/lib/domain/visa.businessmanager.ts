import { FormConfig } from '@lib/domain/form'
import { MatchResult, Matcher, VisaType } from '@lib/domain'
import { matchQualifications } from '@lib/domain/matching'
import {
  NO_MATCHES,
  limitPoints,
  matchOf,
  mergeMatches,
} from '@lib/domain/matching.helpers'
import { errorMessages } from '@lib/domain/errors'
import { z } from 'zod'

export const formConfig: FormConfig = {
  visaType: VisaType.BusinessManager,
  sections: {},
  order: ['education', 'job'],
}

// Comments indicate to what item/項目 they refer to in the official point sheet
// New lines = dark border in point sheet
// (n) = the index as indicated on the right of the point sheet (疎明資料)
export const BusinessManagerQualificationsSchema = z.object({
  // 学歴 (1)
  // Academic background (1)
  degree: z
    .enum(['doctor', 'mba_mot', 'master', 'bachelor', 'none'])
    .optional(),
  dual_degree: z.boolean().optional(),

  // 職歴 (2)
  // Professional career (2)
  // 事業の経営又は管理に係る実務経験
  // Work experience related to business management
  experience: z.number().optional(), // in years

  // 年収 (3)
  // Annual salary (3)
  salary: z.number().optional(), // in yen, only counting that from your main source of income

  // 地位 (20)
  // Position
  // 代表取締役，代表執行役又は代表権のある業務執行社員
  // Person to be accepted as a representative director or representative executive officer
  representative_director: z.boolean().optional(), // (20)
  // 取締役，執行役又は業務執行社員
  // A member of the board of directors, executive officer, or executive member
  executive_officer: z.boolean().optional(), // (20)

  // 特別加算
  // Special additions
  // Ⅰ　イノベーション促進支援措置を受けている
  // I Work for an organization which receives financial support measures(measures provided for separately in a public notice) for the promotion of innovation
  org_promotes_innovation: z.boolean().optional(), // (9)
  // Ⅱ　Ⅰに該当する企業であって，中小企業基本法に規定する中小企業者
  // Ⅱ The organization is a company that comes under I, and constitutes a small or medium-sized enterprise under the Small and Medium-Sized Enterprise Basic Act
  org_smb: z.boolean().optional(), // (10)
  // Ⅲ　産業の国際競争力の強化及び国際的な経済活動の拠点の形成を図るため、地方公共団体における高度人材外国人の受入れを促進するための支援として法務大臣が認めるものを受けている
  // Ⅲ Work for an organization which receives support as a target organization (approved by the Minister of Justice) of  promoting the acceptance of highly skilled foreign workers in local governments in order to strengthen the international competitiveness of industry and form a base for international economic activities
  org_promotes_highly_skilled: z.boolean().optional(), // (11)

  // 特別加算（続き）
  // Special additions (continued)
  // 契約機関が中小企業基本法に規定する中小企業者で，試験研究費及び開発費の合計金額が，総収入金額から固定資産若しくは有価証券の譲渡による収入金額を控除した金額（売上高）の３％超
  // The applicant's organization is a small or medium-sized enterprise under the Small and Medium-sized Enterprise Basic Act and its total experiment and research costs and development costs exceed 3% of the amount remaining after deducting the amount of revenue from the transfer of fixed assets or securities from the total revenue (total sales)
  high_rnd_expenses: z.boolean().optional(), // (10) (12)

  // 従事しようとする業務に関連する外国の資格，表彰等で法務大臣が認めるものを保有
  // Holders of foreign work-related qualifications,awards, etc., recognized by Japan's Minister of Justice
  foreign_qualification: z.boolean().optional(), // (13)

  // 日本の大学を卒業又は大学院の課程を修了
  // Either graduated from a Japanese university or completed a course of a Japanese graduate school
  jp_uni_grad: z.boolean().optional(), // (14)

  // Ⅰ　日本語専攻で外国の大学を卒業又は日本語能力試験Ｎ１合格相当
  // I Either graduated from a foreign university with a major in Japanese-language, or have passed the N1 level of the Japanese-Language Proficiency Test or its equivalent.
  // Ⅱ　日本語能力試験Ｎ２合格相当 (「日本の大学を卒業又は大学院の課程を修了」及びⅠに該当する者を除く)
  // Ⅱ Have passed the N2 level of the Japanese-Language Proficiency Test or its equivalent (Excluding those who "graduated from a university or completed a course of a graduate school in Japan", and those who come under I)
  jp: z.enum(['jp_major', 'n1', 'n2', 'none']).optional(), // (15)

  // 各省が関与する成長分野の先端プロジェクトに従事
  // Work on an advanced project in a growth field with the involvement of the relevant ministries and agencies
  growth_field: z.boolean().optional(), // (16)

  // Ⅰ　以下のランキング２つ以上において３００位以内の外国の大学又はいずれかにランクづけされている本邦の大学
  // * QS・ワールド・ユニバーシティ・ランキングス　(クアクアレリ・シモンズ社（英国）)
  // * THE・ワールド・ユニバーシティ・ランキングス (タイムズ社（英国）)
  // * アカデミック・ランキング・オブ・ワールド・ユニバーシティズ (上海交通大学（中国）)
  // I Foreign universities ranked in the top 300 in at least two of the following university rankings or Japanese universities ranked in one of them
  // QS World University Rankings (QS Quacquarelli Symonds Limited (UK))
  // THE World University Rankings (Times (UK))
  // Academic Ranking of World Universities (of Shanghai Jiao Tong University (China))
  uni_ranked: z.boolean().optional(), // (17)
  // Ⅱ　文部科学省が実施するスーパーグローバル大学創成支援事業（トップ型 及びグローバル化牽引型）において，補助金の交付を受けている大学
  // II Universities receiving subsidies through the Top Global Universities Project implemented by the Ministry of Education, Culture, Sports, Science and Technology
  uni_funded: z.boolean().optional(), // (17)
  // Ⅲ　外務省が実施するイノベーティブ・アジア事業において，「パートナー校」として指定を受けている大学
  // III Universities designated as "partner schools" in the Innovative Asia Project implemented by the Ministry of Foreign Affairs
  uni_partner: z.boolean().optional(), // (17)

  // 外務省が実施するイノベーティブ・アジア事業の一環としてＪＩＣＡが実施する研修を修了したこと
  // Have completed training conducted by JICA as part of the Innovative Asia Project implemented by the Ministry of Foreign Affairs
  training_jica: z.boolean().optional(), // (18)

  // 本邦の公私の機関において行う貿易その他の事業に１億円以上を投資
  // Investment of 100 million yen or more in trade or other business conducted by a public or private organization in Japan
  high_investment: z.boolean().optional(), // (19)

  // 投資運用業等に係る業務に従事
  // Engaged in business related to investment management business, etc.
  investment_management: z.boolean().optional(), // (21)
})

export type BusinessManagerQualifications = z.infer<
  typeof BusinessManagerQualificationsSchema
>

export function calculatePoints(qualifications: BusinessManagerQualifications) {
  return matchQualifications<BusinessManagerQualifications>(
    matchers,
    qualifications,
  )
}

const matchers: Matcher<BusinessManagerQualifications>[] = [
  function matchDegree(q) {
    switch (q.degree) {
      case 'mba_mot':
        return matchOf('mba_mot', 25)
      case 'doctor':
        return matchOf('doctor', 20)
      case 'master':
        return matchOf('master', 20)
      case 'bachelor':
        return matchOf('bachelor', 10)
      default:
        return NO_MATCHES
    }
  },
  function matchDualDegree(q) {
    // Dual degree does not apply if we have no degree
    if (!q.degree || q.degree === 'none') {
      return NO_MATCHES
    }

    if (!q.dual_degree) {
      return NO_MATCHES
    }

    return matchOf('dual_degree', 5)
  },
  function matchWorkExperience(q) {
    const experience = q.experience ?? 0

    if (experience >= 10) {
      return matchOf('10y_plus', 25)
    }
    if (experience >= 7) {
      return matchOf('7y_plus', 20)
    }
    if (experience >= 5) {
      return matchOf('5y_plus', 15)
    }
    if (experience >= 3) {
      return matchOf('3y_plus', 10)
    }

    return NO_MATCHES
  },
  function matchSalary(q) {
    // We need to allow missing salary when we haven't completed the form yet
    if (!q.salary) {
      return NO_MATCHES
    }

    const salary = q.salary ?? 0

    if (salary >= 30_000_000) {
      return matchOf('30m_plus', 50)
    }
    if (salary >= 25_000_000) {
      return matchOf('25m_plus', 40)
    }
    if (salary >= 20_000_000) {
      return matchOf('20m_plus', 30)
    }
    if (salary >= 15_000_000) {
      return matchOf('15m_plus', 20)
    }
    if (salary >= 10_000_000) {
      return matchOf('10m_plus', 10)
    }
    if (salary >= 3_000_000) {
      return NO_MATCHES
    }

    throw new Error(errorMessages.salaryTooLow)
  },
  function matchPosition(q) {
    if (q.representative_director) {
      return matchOf('representative_director', 10)
    }
    if (q.executive_officer) {
      return matchOf('executive_officer', 5)
    }

    return NO_MATCHES
  },
  function matchBonus(q) {
    const matches: MatchResult[] = []

    if (q.high_rnd_expenses && q.org_smb) {
      matches.push(matchOf('high_rnd_expenses', 5))
    }
    if (q.foreign_qualification) {
      matches.push(matchOf('foreign_qualification', 5))
    }
    if (q.growth_field) {
      matches.push(matchOf('growth_field', 10))
    }
    if (q.training_jica) {
      matches.push(matchOf('training_jica', 5))
    }
    if (q.high_investment) {
      matches.push(matchOf('high_investment', 5))
    }
    if (q.investment_management) {
      matches.push(matchOf('investment_management', 10))
    }

    return mergeMatches(matches)
  },
  function matchContractingOrganization(q) {
    const isInnovative = q.org_promotes_innovation ?? false
    const isSmallCompany = q.org_smb ?? false
    const isPromotingHighlySkilled = q.org_promotes_highly_skilled ?? false

    const matches: MatchResult[] = []

    if (isInnovative) {
      matches.push(matchOf('org_promotes_innovation', 10))
    }
    if (isInnovative && isSmallCompany) {
      matches.push(matchOf('org_smb', 10))
    }
    if (isPromotingHighlySkilled) {
      matches.push(matchOf('org_promotes_highly_skilled', 10))
    }

    return mergeMatches(matches)
  },
  function matchJapanese(q) {
    const isJapaneseUniGraduate = q.jp_uni_grad ?? false
    const hasJapaneseMajor = q.jp === 'jp_major'
    const hasN1 = q.jp === 'n1'
    const hasN2 = q.jp === 'n2'

    const matches: MatchResult[] = []

    if (hasN2 && !isJapaneseUniGraduate) {
      matches.push(matchOf('n2', 10))
    }
    if (hasN1) {
      matches.push(matchOf('n1', 15))
    }
    if (hasJapaneseMajor) {
      matches.push(matchOf('jp_major', 15))
    }
    if (isJapaneseUniGraduate) {
      matches.push(matchOf('jp_uni_grad', 10))
    }

    return mergeMatches(matches)
  },
  function matchUniversity(q) {
    const matches: MatchResult[] = []

    if (q.uni_ranked) {
      matches.push(matchOf('uni_ranked', 10))
    }
    if (q.uni_funded) {
      matches.push(matchOf('uni_funded', 10))
    }
    if (q.uni_partner) {
      matches.push(matchOf('uni_partner', 10))
    }

    const merged = mergeMatches(matches)

    return limitPoints(merged, 10)
  },
]
