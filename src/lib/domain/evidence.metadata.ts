// Evidence metadata for HSFP visa application
// Based on the official 高度専門職ポイント計算表 (High Skill Professional Point Calculation Form)
// Note: category and description are fetched from results.criteria.{id} translations

export interface EvidenceItem {
  id: string
  documentsKey: string // Translation key for documents (under results.evidence.items)
  notesKey?: string // Translation key for notes (under results.evidence.items)
}

// Maps criteria IDs to their evidence translation keys
export const evidenceMetadata: Record<string, EvidenceItem> = {
  // Education
  doctor: {
    id: 'doctor',
    documentsKey: 'doctor.documents',
    notesKey: 'doctor.notes',
  },
  mba_mot: {
    id: 'mba_mot',
    documentsKey: 'mba_mot.documents',
    notesKey: 'mba_mot.notes',
  },
  master: { id: 'master', documentsKey: 'master.documents' },
  bachelor: { id: 'bachelor', documentsKey: 'bachelor.documents' },
  dual_degree: {
    id: 'dual_degree',
    documentsKey: 'dual_degree.documents',
    notesKey: 'dual_degree.notes',
  },

  // Professional Experience (shared documents/notes)
  '10y_plus': {
    id: '10y_plus',
    documentsKey: 'experience.documents',
    notesKey: 'experience.notes',
  },
  '7y_plus': {
    id: '7y_plus',
    documentsKey: 'experience.documents',
    notesKey: 'experience.notes',
  },
  '5y_plus': {
    id: '5y_plus',
    documentsKey: 'experience.documents',
    notesKey: 'experience.notes',
  },
  '3y_plus': {
    id: '3y_plus',
    documentsKey: 'experience.documents',
    notesKey: 'experience.notes',
  },

  // Annual Salary (shared documents, different notes by age restriction)
  '10m_plus': {
    id: '10m_plus',
    documentsKey: 'salary.documents',
    notesKey: 'salary.notes',
  },
  '9m_plus': {
    id: '9m_plus',
    documentsKey: 'salary.documents',
    notesKey: 'salary.notes',
  },
  '8m_plus': {
    id: '8m_plus',
    documentsKey: 'salary.documents',
    notesKey: 'salary.notes',
  },
  '7m_plus': {
    id: '7m_plus',
    documentsKey: 'salary.documents',
    notesKey: 'salary_under40.notes',
  },
  '6m_plus': {
    id: '6m_plus',
    documentsKey: 'salary.documents',
    notesKey: 'salary_under40.notes',
  },
  '5m_plus': {
    id: '5m_plus',
    documentsKey: 'salary.documents',
    notesKey: 'salary_under35.notes',
  },
  '4m_plus': {
    id: '4m_plus',
    documentsKey: 'salary.documents',
    notesKey: 'salary_under30.notes',
  },

  // Age (shared documents/notes)
  under_30y: {
    id: 'under_30y',
    documentsKey: 'age.documents',
    notesKey: 'age.notes',
  },
  under_35y: {
    id: 'under_35y',
    documentsKey: 'age.documents',
    notesKey: 'age.notes',
  },
  under_40y: {
    id: 'under_40y',
    documentsKey: 'age.documents',
    notesKey: 'age.notes',
  },

  // Research Achievements
  patent_inventor: {
    id: 'patent_inventor',
    documentsKey: 'patent_inventor.documents',
    notesKey: 'patent_inventor.notes',
  },
  conducted_financed_projects: {
    id: 'conducted_financed_projects',
    documentsKey: 'conducted_financed_projects.documents',
    notesKey: 'conducted_financed_projects.notes',
  },
  published_papers: {
    id: 'published_papers',
    documentsKey: 'published_papers.documents',
    notesKey: 'published_papers.notes',
  },
  recognized_research: {
    id: 'recognized_research',
    documentsKey: 'recognized_research.documents',
    notesKey: 'recognized_research.notes',
  },

  // Certifications (shared documents)
  many_certs: {
    id: 'many_certs',
    documentsKey: 'certs.documents',
    notesKey: 'many_certs.notes',
  },
  single_cert: {
    id: 'single_cert',
    documentsKey: 'certs.documents',
    notesKey: 'single_cert.notes',
  },

  // Organization Bonuses
  org_promotes_innovation: {
    id: 'org_promotes_innovation',
    documentsKey: 'org_promotes_innovation.documents',
    notesKey: 'org_promotes_innovation.notes',
  },
  org_smb: {
    id: 'org_smb',
    documentsKey: 'org_smb.documents',
    notesKey: 'org_smb.notes',
  },
  org_promotes_highly_skilled: {
    id: 'org_promotes_highly_skilled',
    documentsKey: 'org_promotes_highly_skilled.documents',
    notesKey: 'org_promotes_highly_skilled.notes',
  },
  high_rnd_expenses: {
    id: 'high_rnd_expenses',
    documentsKey: 'high_rnd_expenses.documents',
    notesKey: 'high_rnd_expenses.notes',
  },

  // Japanese Language
  jp_major: {
    id: 'jp_major',
    documentsKey: 'jp_major.documents',
    notesKey: 'jp_major.notes',
  },
  n1: { id: 'n1', documentsKey: 'n1.documents', notesKey: 'n1.notes' },
  n2: { id: 'n2', documentsKey: 'n2.documents', notesKey: 'n2.notes' },
  jp_uni_grad: {
    id: 'jp_uni_grad',
    documentsKey: 'jp_uni_grad.documents',
    notesKey: 'jp_uni_grad.notes',
  },

  // University Bonuses (shared documents)
  uni_ranked: {
    id: 'uni_ranked',
    documentsKey: 'uni.documents',
    notesKey: 'uni_ranked.notes',
  },
  uni_funded: {
    id: 'uni_funded',
    documentsKey: 'uni.documents',
    notesKey: 'uni_funded.notes',
  },
  uni_partner: {
    id: 'uni_partner',
    documentsKey: 'uni.documents',
    notesKey: 'uni_partner.notes',
  },

  // Other Bonuses
  foreign_qualification: {
    id: 'foreign_qualification',
    documentsKey: 'foreign_qualification.documents',
    notesKey: 'foreign_qualification.notes',
  },
  growth_field: {
    id: 'growth_field',
    documentsKey: 'growth_field.documents',
    notesKey: 'growth_field.notes',
  },
  training_jica: {
    id: 'training_jica',
    documentsKey: 'training_jica.documents',
    notesKey: 'training_jica.notes',
  },
  investment_management: {
    id: 'investment_management',
    documentsKey: 'investment_management.documents',
    notesKey: 'investment_management.notes',
  },
}

// Helper function to get evidence items for a list of criteria matches
export function getEvidenceForMatches(
  matches: { id: string; points: number }[],
): EvidenceItem[] {
  return matches
    .map(match => evidenceMetadata[match.id])
    .filter((evidence): evidence is EvidenceItem => evidence !== undefined)
}

// Group evidence by category key (criteria ID used to look up category via translations)
export function groupEvidenceByCategoryKey(
  evidenceItems: EvidenceItem[],
  getCategoryKey: (id: string) => string,
): Record<string, EvidenceItem[]> {
  return evidenceItems.reduce(
    (acc, item) => {
      const categoryKey = getCategoryKey(item.id)
      if (!acc[categoryKey]) {
        acc[categoryKey] = []
      }
      acc[categoryKey].push(item)
      return acc
    },
    {} as Record<string, EvidenceItem[]>,
  )
}
