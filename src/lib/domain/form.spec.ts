import { formConfig } from '@lib/visa/visa.engineer'
import { getOverallPromptIndex } from '@lib/domain/form'

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
