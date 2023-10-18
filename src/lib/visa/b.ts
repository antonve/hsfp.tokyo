import { FormConfig } from '@lib/domain/form'
import { MatchResult, Matcher, VisaType } from '@lib/domain'
import { matchQualifications } from '@lib/domain/matching'
import {
  NO_MATCHES,
  limitPoints,
  matchOf,
  mergeMatches,
} from '@lib/domain/matching.helpers'
import { errorMessages } from '@lib/visa/errors'
import { z } from 'zod'

export const formConfig: FormConfig = {
  visaType: VisaType.B,
  sections: {
    'academic-background': [
      {
        id: 'degree',
        type: 'CHOICE',
        options: ['doctor', 'mba_mot', 'master', 'bachelor', 'none'],
      },
      {
        id: 'dual_degree',
        type: 'BOOLEAN',
      },
    ],
    job: [
      {
        id: 'experience',
        type: 'NUMBER',
      },
      {
        id: 'age',
        type: 'NUMBER',
      },
      {
        id: 'salary',
        type: 'NUMBER',
      },
    ],
    'research-achievements': [
      {
        id: 'patent_inventor',
        type: 'BOOLEAN',
      },
      {
        id: 'conducted_financed_projects_three_times',
        type: 'BOOLEAN',
      },
      {
        id: 'has_published_three_papers',
        type: 'BOOLEAN',
      },
      {
        id: 'research_recognized_by_japan',
        type: 'BOOLEAN',
      },
    ],
  },
  order: ['academic-background', 'job'],
}

// Comments indicate to what item/項目 they refer to in the official point sheet
// New lines = dark border in point sheet
// (n) = the index as indicated on the right of the point sheet (疎明資料)
export const EngineerQualificationsSchema = z.object({
  // 学歴 (1)
  // Academic background (1)
  degree: z
    .enum(['doctor', 'mba_mot', 'master', 'bachelor', 'none'])
    .optional(),
  dual_degree: z.boolean().optional(),

  // 職歴 (2)
  // Professional career (2)
  // 従事しようとする業務に係る実務経験
  // Work experience related to the business in which the applicant intends to engage
  experience: z.number().optional(), // years of relevant prefessional experience

  // 年収 (3)
  // Annual salary (3)
  salary: z.number().optional(), // in yen, only counting that from your main source of income

  // 年齢
  // Age
  // 申請の時点の年齢
  // Age at the time of the filing of the application
  age: z.number().optional(), // in years

  // 研究実績
  // Research achievements
  // 発明者として特許を受けた発明が１件以上
  // Have made at least one patented invention
  patent_inventor: z.boolean().optional(), // (4)
  // 外国政府から補助金，競争的資金等を受けた研究に３回以上従事
  // Have conducted projects financed by a competitive fund, etc. by a foreign national government at least three times
  conducted_financed_projects: z.boolean().optional(), // (5)
  // 学術論文データベースに登載されている学術雑誌に掲載された論文が３本以上 (責任著者であるものに限る)
  // Have published at least three papers in academic journals listed in the academic journal database
  published_papers: z.boolean().optional(), // (6)
  // その他法務大臣が認める研究実績
  // Have made other research achievements recognized by Japan's Minister of Justice
  recognized_research: z.boolean().optional(), // (7)

  // 資格
  // License
  // 従事しようとする業務に関連する日本の国家資格（業務独占資格又は名称独占資格）を保有，又はIT告示に定める試験に合格し若しくは資格を保有
  // Either have a national license of Japan (a license that authorizes you to conduct the relevant operation or use the relevant name), or have passed an examination or have a license listed in the relevant IT notification
  certifications: z.number().optional(), // (8)

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
  n1: z.boolean().optional(), // (15)
  // Ⅱ　日本語能力試験Ｎ２合格相当 (「日本の大学を卒業又は大学院の課程を修了」及びⅠに該当する者を除く)
  // Ⅱ Have passed the N2 level of the Japanese-Language Proficiency Test or its equivalent (Excluding those who "graduated from a university or completed a course of a graduate school in Japan", and those who come under I)
  n2: z.boolean().optional(), // (15)

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

  // 投資運用業等に係る業務に従事
  // Engaged in business related to investment management business, etc.
  investment_management: z.boolean().optional(), // (21)
})

export type EngineerQualifications = z.infer<
  typeof EngineerQualificationsSchema
>

export function calculatePoints(qualifications: EngineerQualifications) {
  return matchQualifications<EngineerQualifications>(matchers, qualifications)
}

const matchers: Matcher<EngineerQualifications>[] = [
  function matchDegree(q) {
    switch (q.degree) {
      case 'doctor':
        return matchOf('doctor', 30)
      case 'mba_mot':
        return matchOf('mba_mot', 25)
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
      return matchOf('10y_plus', 20)
    }
    if (experience >= 7) {
      return matchOf('7y_plus', 15)
    }
    if (experience >= 5) {
      return matchOf('5y_plus', 10)
    }
    if (experience >= 3) {
      return matchOf('3y_plus', 5)
    }

    return NO_MATCHES
  },
  function matchSalary(q) {
    // We need to allow missing salary when we haven't completed the form yet
    if (!q.salary) {
      return NO_MATCHES
    }

    const salary = q.salary ?? 0
    const age = q.age ?? 100

    if (salary >= 10_000_000) {
      return matchOf('10m_plus', 40)
    }
    if (salary >= 9_000_000) {
      return matchOf('9m_plus', 35)
    }
    if (salary >= 8_000_000) {
      return matchOf('8m_plus', 30)
    }
    if (salary >= 7_000_000 && age < 40) {
      return matchOf('7m_plus', 25)
    }
    if (salary >= 6_000_000 && age < 40) {
      return matchOf('6m_plus', 20)
    }
    if (salary >= 5_000_000 && age < 35) {
      return matchOf('5m_plus', 15)
    }
    if (salary >= 4_000_000 && age < 30) {
      return matchOf('4m_plus', 10)
    }
    if (salary >= 3_000_000) {
      return NO_MATCHES
    }

    throw new Error(errorMessages.salaryTooLow)
  },
  function matchAge(q) {
    const age = q.age ?? 100

    if (age < 30) {
      return matchOf('under_30y', 15)
    }
    if (age < 35) {
      return matchOf('under_35y', 10)
    }
    if (age < 40) {
      return matchOf('under_40y', 5)
    }

    return NO_MATCHES
  },
  function matchResearchAchievements(q) {
    const matches: MatchResult[] = []

    if (q.patent_inventor) {
      matches.push(matchOf('patent_inventor', 15))
    }
    if (q.conducted_financed_projects) {
      matches.push(matchOf('conducted_financed_projects', 15))
    }
    if (q.published_papers) {
      matches.push(matchOf('published_papers', 15))
    }
    if (q.recognized_research) {
      matches.push(matchOf('recognized_research', 15))
    }

    const merged = mergeMatches(matches)

    return limitPoints(merged, 15)
  },
  function matchCertifications(q) {
    const certifications = q.certifications ?? 0

    if (certifications >= 2) {
      return matchOf('many_certs', 10)
    }
    if (certifications == 1) {
      return matchOf('single_cert', 5)
    }

    return NO_MATCHES
  },
  function matchBonus(q) {
    const matches: MatchResult[] = []

    if (q.high_rnd_expenses) {
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
    const hasN1 = q.n1 ?? false
    const hasN2 = q.n2 ?? false

    const matches: MatchResult[] = []

    if (hasN2 && !hasN1 && !isJapaneseUniGraduate) {
      matches.push(matchOf('n2', 10))
    }
    if (hasN1) {
      matches.push(matchOf('n1', 15))
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
