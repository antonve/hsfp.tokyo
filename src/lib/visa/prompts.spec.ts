import {
  withCompletedPrompt,
  isPromptCompleted,
  didCompleteSection,
} from '@lib/visa/prompts'
import { QualificationsSchema } from '@lib/visa'
import { VisaType } from '@lib/domain'
import { formConfig } from '@lib/visa/b'

describe('prompt completion operations', () => {
  function createQualification(completed: number) {
    return QualificationsSchema.parse({
      v: VisaType.Engineer,
      completed,
    })
  }

  describe('withCompletedPrompt', () => {
    it('should set a prompt as completed', () => {
      const before = createQualification(0)
      const after = withCompletedPrompt(5, before)
      expect(after.completed).toBe(0b100000)
    })

    it('should set a prompt as completed, even if it is already set', () => {
      const before = createQualification(0b100000)
      const after = withCompletedPrompt(5, before)
      expect(after.completed).toBe(0b100000)
    })

    it('should set a prompt as completed, without affecting other completed promps', () => {
      const before = createQualification(0b10000)
      const after = withCompletedPrompt(5, before)
      expect(after.completed).toBe(0b110000)
    })
  })

  describe('isPromptCompleted', () => {
    it('should be able to check if a prompt is completed', () => {
      const q = createQualification(0b100)
      const isCompleted = isPromptCompleted(2, q)
      expect(isCompleted).toBeTrue()
    })

    it('should be able to check if a prompt is not completed', () => {
      const q = createQualification(0b100)
      const isCompleted = isPromptCompleted(5, q)
      expect(isCompleted).toBeFalse()
    })
  })

  describe('didCompleteSection', () => {
    it('should detect completed section', () => {
      const q = createQualification(0b111)
      const isCompleted = didCompleteSection(q, formConfig, 'education')
      expect(isCompleted).toBeTrue()
    })

    it('should detect incomplete section', () => {
      const q = createQualification(0b101)
      const isCompleted = didCompleteSection(q, formConfig, 'job')
      expect(isCompleted).toBeFalse()
    })
  })
})
