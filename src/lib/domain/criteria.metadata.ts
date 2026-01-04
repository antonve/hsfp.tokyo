// Metadata for criteria to display in results breakdown
export interface CriteriaMetadata {
  category: string
  explanation: string
}

// Maps criteria IDs to their display metadata
export const criteriaMetadata: Record<string, CriteriaMetadata> = {
  // Education - Degree
  doctor: {
    category: 'Education',
    explanation: 'Doctorate degree',
  },
  mba_mot: {
    category: 'Education',
    explanation: 'Management degree (MBA/MOT)',
  },
  master: {
    category: 'Education',
    explanation: 'Master degree',
  },
  bachelor: {
    category: 'Education',
    explanation: 'Bachelor degree',
  },
  dual_degree: {
    category: 'Education',
    explanation: 'Multiple degrees in different fields',
  },

  // Professional Experience
  '10y_plus': {
    category: 'Professional Experience',
    explanation: '10+ years of relevant experience',
  },
  '7y_plus': {
    category: 'Professional Experience',
    explanation: '7+ years of relevant experience',
  },
  '5y_plus': {
    category: 'Professional Experience',
    explanation: '5+ years of relevant experience',
  },
  '3y_plus': {
    category: 'Professional Experience',
    explanation: '3+ years of relevant experience',
  },

  // Annual Salary
  '10m_plus': {
    category: 'Annual Salary',
    explanation: '¥10,000,000+ annual salary',
  },
  '9m_plus': {
    category: 'Annual Salary',
    explanation: '¥9,000,000+ annual salary',
  },
  '8m_plus': {
    category: 'Annual Salary',
    explanation: '¥8,000,000+ annual salary',
  },
  '7m_plus': {
    category: 'Annual Salary',
    explanation: '¥7,000,000+ annual salary (under 40)',
  },
  '6m_plus': {
    category: 'Annual Salary',
    explanation: '¥6,000,000+ annual salary (under 40)',
  },
  '5m_plus': {
    category: 'Annual Salary',
    explanation: '¥5,000,000+ annual salary (under 35)',
  },
  '4m_plus': {
    category: 'Annual Salary',
    explanation: '¥4,000,000+ annual salary (under 30)',
  },

  // Age
  under_30y: {
    category: 'Age',
    explanation: 'Under 30 years old',
  },
  under_35y: {
    category: 'Age',
    explanation: 'Under 35 years old',
  },
  under_40y: {
    category: 'Age',
    explanation: 'Under 40 years old',
  },

  // Research Achievements
  patent_inventor: {
    category: 'Research Achievements',
    explanation: 'Inventor of patented invention',
  },
  conducted_financed_projects: {
    category: 'Research Achievements',
    explanation: 'Conducted foreign government funded research (3+ times)',
  },
  published_papers: {
    category: 'Research Achievements',
    explanation: 'Published papers in academic journals (3+ as corresponding author)',
  },
  recognized_research: {
    category: 'Research Achievements',
    explanation: 'Other research achievements recognized by Minister of Justice',
  },

  // Certifications
  many_certs: {
    category: 'Certifications',
    explanation: '2+ national or IT certifications',
  },
  single_cert: {
    category: 'Certifications',
    explanation: '1 national or IT certification',
  },

  // Organization Bonuses
  org_promotes_innovation: {
    category: 'Organization',
    explanation: 'Works for organization receiving innovation support',
  },
  org_smb: {
    category: 'Organization',
    explanation: 'Small/medium enterprise receiving innovation support',
  },
  org_promotes_highly_skilled: {
    category: 'Organization',
    explanation: 'Organization supported for accepting highly skilled workers',
  },
  high_rnd_expenses: {
    category: 'Organization',
    explanation: 'SME with R&D costs exceeding 3% of revenue',
  },

  // Japanese Language
  jp_major: {
    category: 'Japanese Language',
    explanation: 'Major in Japanese language',
  },
  n1: {
    category: 'Japanese Language',
    explanation: 'JLPT N1 or equivalent',
  },
  n2: {
    category: 'Japanese Language',
    explanation: 'JLPT N2 or equivalent',
  },
  jp_uni_grad: {
    category: 'Japanese Language',
    explanation: 'Graduated from Japanese university',
  },

  // University
  uni_ranked: {
    category: 'University',
    explanation: 'Graduated from top 300 ranked university',
  },
  uni_funded: {
    category: 'University',
    explanation: 'Graduated from university funded by Top Global Universities Project',
  },
  uni_partner: {
    category: 'University',
    explanation: 'Graduated from Innovative Asia Project partner school',
  },

  // Other Bonuses
  foreign_qualification: {
    category: 'Bonus',
    explanation: 'Foreign work-related qualifications recognized by Minister of Justice',
  },
  growth_field: {
    category: 'Bonus',
    explanation: 'Working on advanced project in growth field',
  },
  training_jica: {
    category: 'Bonus',
    explanation: 'Completed JICA training (Innovative Asia Project)',
  },
  investment_management: {
    category: 'Bonus',
    explanation: 'Engaged in investment management business',
  },
}
