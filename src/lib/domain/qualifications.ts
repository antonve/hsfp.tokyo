import { z } from 'zod'

export const QualificationsSchema = z.object({
  degree: z
    .enum(['doctor', 'master', 'bachelor', 'business_management', 'none'])
    .optional(),
  dual_degree: z.boolean().optional(),
  experience: z.number().optional(), // years of relevant prefessional experience
  salary: z.number().optional(), // in yen, only counting that from your main source of income
  representative_director: z.boolean().optional(),
  executive_officer: z.boolean().optional(),
  high_rnd_expenses: z.boolean().optional(), // prev: rnd_exceeds_three_percent
  foreign_qualification: z.boolean().optional(), // prev: foreign_work_related_qualification
  growth_field: z.boolean().optional(), // prev: advanced_project_growth_field
  training_jica: z.boolean().optional(), // prev: completed_training_conducted_by_jica_innovative_asia_project
  high_investment: z.boolean().optional(), // prev: invested_over_100_million_yen_in_japan
  investment_management: z.boolean().optional(), // prev: investment_management_business
  org_promotes_innovation: z.boolean().optional(), // prev: contracting_organization_promotes_innovation
  org_smb: z.boolean().optional(), // prev: contracting_organization_small_medium_sized
  org_promotes_highly_skilled: z.boolean().optional(), // prev: contracting_organization_promotes_highly_skilled
  jp_uni_grad: z.boolean().optional(), // prev: graduated_japanese_uni_or_course
  n1: z.boolean().optional(), // prev: jlpt_n1_or_equivalent
  n2: z.boolean().optional(), // prev: jlpt_n2_or_equivalent
  uni_ranked: z.boolean().optional(), // prev: top_ranked_university_graduate
  uni_funded: z.boolean().optional(), // prev: graduate_of_university_funded_by_top_global_universities_project
  uni_partner: z.boolean().optional(), // prev: graduate_of_university_partner_school
  patent_inventor: z.boolean().optional(),
  conducted_financed_projects: z.boolean().optional(), // prev: conducted_financed_projects_three_times
  published_papers: z.boolean().optional(), // prev: has_published_three_papers
  recognized_research: z.boolean().optional(), // prev: research_recognized_by_japan
  certifications: z.number().optional(), // prev: has_one_national_license | has_two_or_more_national_license
})

export type Qualifications = z.infer<typeof QualificationsSchema>
