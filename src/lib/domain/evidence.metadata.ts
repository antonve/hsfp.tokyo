// Evidence metadata for HSFP visa application
// Based on the official 高度専門職ポイント計算表 (High Skill Professional Point Calculation Form)

export interface EvidenceItem {
  id: string
  category: string
  description: string
  documents: string[]
  notes?: string
}

// Maps criteria IDs to their required evidence
export const evidenceMetadata: Record<string, EvidenceItem> = {
  // Education - Degree (①)
  doctor: {
    id: 'doctor',
    category: 'Education',
    description: 'Doctorate degree',
    documents: [
      'Graduation certificate or diploma',
      'Degree certificate (showing doctorate was conferred)',
      'Academic transcript (if degree type is unclear from certificate)',
    ],
    notes:
      'Documents must clearly show the type of degree obtained. If original documents are not in Japanese or English, a certified translation is required.',
  },
  mba_mot: {
    id: 'mba_mot',
    category: 'Education',
    description: 'Management degree (MBA/MOT)',
    documents: [
      'Graduation certificate or diploma',
      'Degree certificate (showing MBA or MOT was conferred)',
      'Academic transcript (if degree type is unclear from certificate)',
    ],
    notes:
      'Only MBA (Master of Business Administration) or MOT (Master of Technology Management) degrees qualify. Must have graduated from university before obtaining MBA/MOT for bonus points.',
  },
  master: {
    id: 'master',
    category: 'Education',
    description: 'Master degree',
    documents: [
      'Graduation certificate or diploma',
      'Degree certificate (showing master degree was conferred)',
    ],
  },
  bachelor: {
    id: 'bachelor',
    category: 'Education',
    description: 'Bachelor degree',
    documents: [
      'Graduation certificate or diploma',
      'Degree certificate (showing bachelor degree was conferred)',
    ],
  },
  dual_degree: {
    id: 'dual_degree',
    category: 'Education',
    description: 'Multiple degrees in different fields',
    documents: [
      'Graduation certificates for each degree',
      'Academic transcripts showing different major fields',
      'Degree certificates for each qualification',
    ],
    notes:
      'Degrees must be in different academic fields (e.g., Engineering + Business). Both a master and doctorate count as 30 points total.',
  },

  // Professional Experience (②)
  '10y_plus': {
    id: '10y_plus',
    category: 'Professional Experience',
    description: '10+ years of relevant experience',
    documents: [
      'Documents proving work content and duration (e.g., employment certificate, contract, appointment letter)',
    ],
    notes:
      'Experience must be related to the activities you will engage in under the HSFP visa. Documents should show job title, duties, and employment period.',
  },
  '7y_plus': {
    id: '7y_plus',
    category: 'Professional Experience',
    description: '7+ years of relevant experience',
    documents: [
      'Documents proving work content and duration (e.g., employment certificate, contract, appointment letter)',
    ],
    notes:
      'Experience must be related to the activities you will engage in under the HSFP visa. Documents should show job title, duties, and employment period.',
  },
  '5y_plus': {
    id: '5y_plus',
    category: 'Professional Experience',
    description: '5+ years of relevant experience',
    documents: [
      'Documents proving work content and duration (e.g., employment certificate, contract, appointment letter)',
    ],
    notes:
      'Experience must be related to the activities you will engage in under the HSFP visa. Documents should show job title, duties, and employment period.',
  },
  '3y_plus': {
    id: '3y_plus',
    category: 'Professional Experience',
    description: '3+ years of relevant experience',
    documents: [
      'Documents proving work content and duration (e.g., employment certificate, contract, appointment letter)',
    ],
    notes:
      'Experience must be related to the activities you will engage in under the HSFP visa. Documents should show job title, duties, and employment period.',
  },

  // Annual Salary (③)
  '10m_plus': {
    id: '10m_plus',
    category: 'Annual Salary',
    description: '¥10,000,000+ annual salary',
    documents: [
      'Employment contract showing annual compensation',
      'Offer letter with salary details',
      'For renewals: withholding tax statement (源泉徴収票) or tax certificate',
    ],
    notes:
      'Salary must be the expected annual compensation from your contracting organization in Japan. Bonuses and allowances are included, but commuting and housing allowances are typically excluded.',
  },
  '9m_plus': {
    id: '9m_plus',
    category: 'Annual Salary',
    description: '¥9,000,000+ annual salary',
    documents: [
      'Employment contract showing annual compensation',
      'Offer letter with salary details',
      'For renewals: withholding tax statement (源泉徴収票) or tax certificate',
    ],
    notes:
      'Salary must be the expected annual compensation from your contracting organization in Japan.',
  },
  '8m_plus': {
    id: '8m_plus',
    category: 'Annual Salary',
    description: '¥8,000,000+ annual salary',
    documents: [
      'Employment contract showing annual compensation',
      'Offer letter with salary details',
      'For renewals: withholding tax statement (源泉徴収票) or tax certificate',
    ],
    notes:
      'Salary must be the expected annual compensation from your contracting organization in Japan.',
  },
  '7m_plus': {
    id: '7m_plus',
    category: 'Annual Salary',
    description: '¥7,000,000+ annual salary',
    documents: [
      'Employment contract showing annual compensation',
      'Offer letter with salary details',
      'For renewals: withholding tax statement (源泉徴収票) or tax certificate',
    ],
    notes: 'Only applicable if under 40 years old at time of application.',
  },
  '6m_plus': {
    id: '6m_plus',
    category: 'Annual Salary',
    description: '¥6,000,000+ annual salary',
    documents: [
      'Employment contract showing annual compensation',
      'Offer letter with salary details',
      'For renewals: withholding tax statement (源泉徴収票) or tax certificate',
    ],
    notes: 'Only applicable if under 40 years old at time of application.',
  },
  '5m_plus': {
    id: '5m_plus',
    category: 'Annual Salary',
    description: '¥5,000,000+ annual salary',
    documents: [
      'Employment contract showing annual compensation',
      'Offer letter with salary details',
      'For renewals: withholding tax statement (源泉徴収票) or tax certificate',
    ],
    notes: 'Only applicable if under 35 years old at time of application.',
  },
  '4m_plus': {
    id: '4m_plus',
    category: 'Annual Salary',
    description: '¥4,000,000+ annual salary',
    documents: [
      'Employment contract showing annual compensation',
      'Offer letter with salary details',
      'For renewals: withholding tax statement (源泉徴収票) or tax certificate',
    ],
    notes: 'Only applicable if under 30 years old at time of application.',
  },

  // Age - Verified from passport
  under_30y: {
    id: 'under_30y',
    category: 'Age',
    description: 'Under 30 years old',
    documents: ['Passport (copy of bio-data page)'],
    notes: 'Age is verified from your passport at time of application.',
  },
  under_35y: {
    id: 'under_35y',
    category: 'Age',
    description: 'Under 35 years old',
    documents: ['Passport (copy of bio-data page)'],
    notes: 'Age is verified from your passport at time of application.',
  },
  under_40y: {
    id: 'under_40y',
    category: 'Age',
    description: 'Under 40 years old',
    documents: ['Passport (copy of bio-data page)'],
    notes: 'Age is verified from your passport at time of application.',
  },

  // Research Achievements (④⑤⑥⑦)
  patent_inventor: {
    id: 'patent_inventor',
    category: 'Research Achievements',
    description: 'Inventor of patented invention',
    documents: [
      "Copy of patent certificate with applicant's name clearly shown as inventor",
    ],
    notes:
      'You must be listed as an inventor on the patent(s) you are claiming.',
  },
  conducted_financed_projects: {
    id: 'conducted_financed_projects',
    category: 'Research Achievements',
    description: 'Conducted foreign government funded research (3+ times)',
    documents: [
      "Grant award notification or funding decision documents with applicant's name",
    ],
    notes:
      'Must have received competitive research funding from a foreign government at least 3 times.',
  },
  published_papers: {
    id: 'published_papers',
    category: 'Research Achievements',
    description:
      'Published papers in academic journals (3+ as corresponding author)',
    documents: [
      'List of publications with: title, author names, journal name, issue number, volume, pages, publication year',
    ],
    notes:
      'Papers must be in journals indexed in academic databases such as Web of Science (Clarivate/Thomson Reuters) or Scopus (Elsevier). You must be the responsible/corresponding author.',
  },
  recognized_research: {
    id: 'recognized_research',
    category: 'Research Achievements',
    description:
      'Other research achievements recognized by Minister of Justice',
    documents: ['Documentation proving the research achievement'],
    notes:
      'This is a catch-all category for research achievements not covered by other criteria. Consult with immigration for guidance on what qualifies and required documentation.',
  },

  // Certifications (⑧)
  many_certs: {
    id: 'many_certs',
    category: 'Certifications',
    description: '2+ national or IT certifications',
    documents: [
      'Certificate copies for each qualification',
      'Proof of passing examination (合格証明書)',
    ],
    notes:
      'Qualifications must be Japanese national certifications (国家資格) or IT certifications listed in the IT certification announcement (IT告示). Business-exclusive qualifications (業務独占資格) or name-exclusive qualifications (名称独占資格) qualify.',
  },
  single_cert: {
    id: 'single_cert',
    category: 'Certifications',
    description: '1 national or IT certification',
    documents: [
      'Certificate copy',
      'Proof of passing examination (合格証明書)',
    ],
    notes:
      'Must be a Japanese national certification (国家資格) or IT certification listed in the IT certification announcement (IT告示).',
  },

  // Organization Bonuses (⑨⑩⑪⑫)
  org_promotes_innovation: {
    id: 'org_promotes_innovation',
    category: 'Organization',
    description: 'Works for organization receiving innovation support',
    documents: [
      'Copy of subsidy/grant award decision notification (補助金交付決定通知書の写し)',
      'Company documentation proving innovation support status',
    ],
    notes:
      'Organization must be receiving financial support measures for promotion of innovation.',
  },
  org_smb: {
    id: 'org_smb',
    category: 'Organization',
    description: 'Small/medium enterprise receiving innovation support',
    documents: [
      'Company brochure or website showing company size',
      'Corporate registration certificate (法人の登記事項証明書)',
      'Documents showing capital amount and number of employees',
      'Financial statements showing revenue and employee count',
    ],
    notes:
      'Must meet SME criteria under the Small and Medium-Sized Enterprise Basic Act: Manufacturing: capital ≤¥300M or employees ≤300; Wholesale: capital ≤¥100M or employees ≤100; Retail: capital ≤¥50M or employees ≤50; Service: capital ≤¥50M or employees ≤100.',
  },
  org_promotes_highly_skilled: {
    id: 'org_promotes_highly_skilled',
    category: 'Organization',
    description: 'Organization supported for accepting highly skilled workers',
    documents: [
      'Copy of subsidy/grant award decision notification (補助金交付決定通知書の写し)',
      'Documentation from local government showing support for highly skilled worker acceptance',
    ],
    notes:
      'Organization receives support from local public entities for promoting acceptance of highly skilled foreign workers.',
  },
  high_rnd_expenses: {
    id: 'high_rnd_expenses',
    category: 'Organization',
    description: 'SME with R&D costs exceeding 3% of revenue',
    documents: [
      'Financial statements (決算書) showing R&D expenses and total revenue',
      'Or: certification letter from a certified tax accountant (税理士), CPA (公認会計士), or SME consultant (中小企業診断士)',
    ],
    notes:
      'R&D expenses must exceed 3% of total revenue (gross revenue minus income from securities transactions). Must be an SME. The professional certification is a letter issued by the accountant/consultant certifying the R&D ratio.',
  },

  // Japanese Language (⑭⑮)
  jp_major: {
    id: 'jp_major',
    category: 'Japanese Language',
    description: 'Major in Japanese language',
    documents: [
      'Graduation certificate showing Japanese language major',
      'Academic transcript showing Japanese language as major field of study',
    ],
    notes:
      'Must have majored in Japanese language at a foreign university or graduated from a foreign university where instruction was primarily in Japanese.',
  },
  n1: {
    id: 'n1',
    category: 'Japanese Language',
    description: 'JLPT N1 or equivalent',
    documents: [
      'JLPT N1 certificate (日本語能力試験N1合格証明書)',
      'Or equivalent certification (BJT Business Japanese Test J1+, etc.)',
    ],
    notes:
      'Cannot claim both N1/N2 and Japanese university graduation points together (except for those listed in ① above).',
  },
  n2: {
    id: 'n2',
    category: 'Japanese Language',
    description: 'JLPT N2 or equivalent',
    documents: [
      'JLPT N2 certificate (日本語能力試験N2合格証明書)',
      'Or equivalent certification',
    ],
    notes:
      'Cannot be claimed if you graduated from a Japanese university or completed a graduate program in Japan. Cannot claim both N1/N2 and Japanese university graduation points (except for those listed in ① above).',
  },
  jp_uni_grad: {
    id: 'jp_uni_grad',
    category: 'Japanese Language',
    description: 'Graduated from Japanese university',
    documents: [
      'Graduation certificate from Japanese university',
      'Degree certificate from Japanese institution',
    ],
    notes:
      'Includes completion of graduate programs (master or doctorate) at Japanese universities.',
  },

  // University Bonuses (⑰)
  uni_ranked: {
    id: 'uni_ranked',
    category: 'University',
    description: 'Graduated from top 300 ranked university',
    documents: ['Graduation certificate', 'Degree certificate'],
    notes:
      'Foreign universities must appear in top 300 of at least 2 of the 3 rankings (QS, THE, ARWU). Japanese universities only need to appear in 1 ranking. Can be claimed together with "Graduated from Japanese university" bonus.',
  },
  uni_funded: {
    id: 'uni_funded',
    category: 'University',
    description:
      'Graduated from university funded by Top Global Universities Project',
    documents: ['Graduation certificate', 'Degree certificate'],
    notes:
      'University must receive subsidies under the Top Global Universities Project (スーパーグローバル大学創成支援事業) implemented by MEXT. Can be claimed together with "Graduated from Japanese university" bonus.',
  },
  uni_partner: {
    id: 'uni_partner',
    category: 'University',
    description: 'Graduated from Innovative Asia Project partner school',
    documents: ['Graduation certificate', 'Degree certificate'],
    notes:
      'University must be designated as a "Partner School" in the Innovative Asia Project (イノベーティブ・アジア事業) implemented by Ministry of Foreign Affairs. Can be claimed together with "Graduated from Japanese university" bonus.',
  },

  // Other Bonuses (⑬⑯⑱)
  foreign_qualification: {
    id: 'foreign_qualification',
    category: 'Bonus',
    description:
      'Foreign work-related qualifications recognized by Minister of Justice',
    documents: ['Certificate or license document for the qualification'],
    notes:
      'Must be a qualification from the designated list published by the Ministry of Justice. For awards related to enterprise products/services, you must have been professionally involved in creating/developing them (not just as a purchaser).',
  },
  growth_field: {
    id: 'growth_field',
    category: 'Bonus',
    description: 'Working on advanced project in growth field',
    documents: [
      'Documentation from employer about the project',
      'Notification or certification from relevant ministry showing project is in designated growth field',
    ],
    notes:
      'Project must be in a growth field with involvement of relevant government ministries and agencies.',
  },
  training_jica: {
    id: 'training_jica',
    category: 'Bonus',
    description: 'Completed JICA training (Innovative Asia Project)',
    documents: ['JICA training completion certificate (JICA研修修了証明書)'],
    notes:
      'Training must be conducted by JICA as part of the Innovative Asia Project, with a training period of at least 1 year. If submitting JICA completion certificate, academic and employment documents are generally not required unless claiming work experience points.',
  },
  investment_management: {
    id: 'investment_management',
    category: 'Bonus',
    description: 'Engaged in investment management business',
    documents: [
      'Employment contract describing investment management duties',
      'Documentation of investment fund management activities',
      'Evidence of managing assets exceeding ¥100M in trades/investments for third parties',
    ],
    notes:
      'Applies to those engaged in investment fund management or discretionary investment business. Must be managing substantial third-party investments.',
  },
}

// Helper function to get evidence for a list of criteria matches
export function getEvidenceForMatches(
  matches: { id: string; points: number }[],
): EvidenceItem[] {
  return matches
    .map(match => evidenceMetadata[match.id])
    .filter((evidence): evidence is EvidenceItem => evidence !== undefined)
}

// Group evidence by category
export function groupEvidenceByCategory(
  evidenceItems: EvidenceItem[],
): Record<string, EvidenceItem[]> {
  return evidenceItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, EvidenceItem[]>,
  )
}
