import { formConfig } from '@lib/domain/visa.engineer'
import { getFormProgress, getOverallPromptIndex } from '@lib/domain/form'
import { QualificationsSchema } from './qualifications'
import { VisaType } from '.'

function createQualification(
  completed: number,
  additionalFields: Record<string, unknown> = {},
) {
  return QualificationsSchema.parse({
    v: VisaType.Engineer,
    completed: getQualificationsMaskForCompleted(completed),
    ...additionalFields,
  })
}

function getQualificationsMaskForCompleted(completed: number) {
  let mask = 0

  for (let index = 0; index < completed; index++) {
    mask = (mask << 1) + 1
  }

  return mask
}

describe('getOverallPromptIndex', () => {
  it('should calculate correctly: job.1', () => {
    const index = getOverallPromptIndex(formConfig, 'job', 1)
    expect(index).toBe(3)
  })

  it('should calculate correctly: education.0', () => {
    const index = getOverallPromptIndex(formConfig, 'education', 0)
    expect(index).toBe(0)
  })
})

describe('getFormProgress', () => {
  it('should return 0 for no qualifications', () => {
    const progress = getFormProgress(formConfig, createQualification(0))
    expect(progress).toBe(0)
  })

  it('should return 100 for all qualifications', () => {
    const progress = getFormProgress(formConfig, createQualification(23)) // 23 prompts in engineer form
    expect(progress).toBe(100)
  })

  it('should return accurate progress when in the middle of the form', () => {
    const progress = getFormProgress(formConfig, createQualification(5))
    expect(progress).toBeCloseTo(21.739)
  })

  it('should count skipped prompts due to cap groups as completed', () => {
    // When patent_inventor is true (prompt index 5), the research cap is maxed
    // This means prompts 6, 7, 8 (conducted_financed_projects, published_papers, recognized_research) are skipped
    // Complete prompts 0-5 (6 prompts) + 3 skipped = 9 prompts worth of progress
    const progress = getFormProgress(
      formConfig,
      createQualification(6, { patent_inventor: true }),
    )
    // 9 out of 23 prompts = 39.13%
    expect(progress).toBeCloseTo(39.13, 1)
  })

  it('should reach 100% when all non-skipped prompts are completed', () => {
    // With patent_inventor: true, 3 research prompts are skipped
    // We need to complete 20 prompts (23 - 3 skipped)
    // Complete all 23 prompts worth of bitmask
    const progress = getFormProgress(
      formConfig,
      createQualification(23, { patent_inventor: true }),
    )
    expect(progress).toBe(100)
  })
})
