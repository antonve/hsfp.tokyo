import {
  MatchResult,
  Matcher,
  NO_MATCHES,
  matchQualifications,
  limitPoints,
  matchOf,
  mergeMatches,
} from '@lib/domain/calculator'
import { FormConfig } from '@lib/domain/form'
import { errorMessages } from './errors'
import { z } from 'zod'

export const formConfig: FormConfig = {
  sections: {},
  order: [],
}

// Comments indicate to what item/項目 they refer to in the official point sheet
// New lines = dark border in point sheet
// (n) = the index as indicated on the right of the point sheet (疎明資料)
export const ResearcherQualificationsSchema = z.object({
  // 学歴 (1)
  degree: z.enum(['doctor', 'master', 'bachelor', 'none']).optional(),
  dual_degree: z.boolean().optional(),

  // 職歴 (2)
  experience: z.number().optional(), // years of relevant prefessional experience

  // 年収 (3)
  salary: z.number().optional(), // in yen, only counting that from your main source of income

  // 年齢
  age: z.number().optional(), // in years

  // 研究実績
  patent_inventor: z.boolean().optional(), // (4)
  conducted_financed_projects: z.boolean().optional(), // (5)
  published_papers: z.boolean().optional(), // (6)
  recognized_research: z.boolean().optional(), // (7)

  // 特別加算
  org_promotes_innovation: z.boolean().optional(), // (9)
  org_smb: z.boolean().optional(), // (10)
  org_promotes_highly_skilled: z.boolean().optional(), // (11)

  high_rnd_expenses: z.boolean().optional(), // (10) (12)

  // 特別加算（続き）
  foreign_qualification: z.boolean().optional(), // (13)

  jp_uni_grad: z.boolean().optional(), // (14)

  n1: z.boolean().optional(), // (15)
  n2: z.boolean().optional(), // (15)

  growth_field: z.boolean().optional(), // (16)

  uni_ranked: z.boolean().optional(), // (17)
  uni_funded: z.boolean().optional(), // (17)
  uni_partner: z.boolean().optional(), // (17)

  training_jica: z.boolean().optional(), // 18
})

export type ResearcherQualifications = z.infer<
  typeof ResearcherQualificationsSchema
>

export function calculatePoints(qualifications: ResearcherQualifications) {
  return matchQualifications<ResearcherQualifications>(matchers, qualifications)
}

const matchers: Matcher<ResearcherQualifications>[] = [
  function matchDegree(q) {
    switch (q.degree) {
      case 'doctor':
        return matchOf('doctor', 30)
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
      matches.push(matchOf('patent_inventor', 20))
    }
    if (q.conducted_financed_projects) {
      matches.push(matchOf('conducted_financed_projects', 20))
    }
    if (q.published_papers) {
      matches.push(matchOf('published_papers', 20))
    }
    if (q.recognized_research) {
      matches.push(matchOf('recognized_research', 20))
    }

    const merged = mergeMatches(matches)

    return limitPoints(merged, 25)
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
