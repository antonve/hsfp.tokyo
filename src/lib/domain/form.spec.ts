import { formConfig } from '@lib/domain/visa.engineer'
import { getFormProgress, getOverallPromptIndex } from '@lib/domain/form'
import { QualificationsSchema } from './qualifications'
import { VisaType } from '.'

function createQualification(completed: number) {
  return QualificationsSchema.parse({
    v: VisaType.Engineer,
    completed: getQualificationsMaskForCompleted(completed),
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
})
