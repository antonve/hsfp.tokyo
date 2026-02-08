import { VisaProgressBar } from '@components/VisaProgressBar'
import { VisaType } from '@lib/domain'
import { FormConfig } from '@lib/domain/form'
import { QualificationsSchema } from '@lib/domain/qualifications'
import { renderWithIntl } from '../test-utils/renderWithIntl'

describe('VisaProgressBar', () => {
  // Create a minimal form config for testing
  const testFormConfig: FormConfig = {
    visaType: VisaType.Engineer,
    sections: {
      education: [
        { id: 'degree', type: 'CHOICE', options: ['doctor', 'master', 'none'] },
        { id: 'dual_degree', type: 'BOOLEAN' },
      ],
      job: [
        { id: 'experience', type: 'NUMBER', config: { min: 0, max: 50 } },
        { id: 'age', type: 'NUMBER', config: { min: 18, max: 120 } },
      ],
    },
    order: ['education', 'job'],
  }

  const baseQualifications = QualificationsSchema.parse({
    v: VisaType.Engineer,
    completed: 0,
    s: 'test-session',
  })

  it('renders progress bar with 0% width when no prompts completed', () => {
    const { container } = renderWithIntl(
      <VisaProgressBar
        config={testFormConfig}
        qualifications={baseQualifications}
        doesQualify={false}
      />,
    )

    const progressBar = container.querySelector('[style*="width"]')
    expect(progressBar).toHaveStyle({ width: '0%' })
  })

  it('renders progress bar with 50% width when half of prompts completed', () => {
    // With 4 prompts total, completing 2 should give 50%
    // completed bitmask: 0b11 = 3 means prompts 0 and 1 are completed
    const halfCompletedQualifications = QualificationsSchema.parse({
      v: VisaType.Engineer,
      completed: 0b11,
      s: 'test-session',
    })

    const { container } = renderWithIntl(
      <VisaProgressBar
        config={testFormConfig}
        qualifications={halfCompletedQualifications}
        doesQualify={false}
      />,
    )

    const progressBar = container.querySelector('[style*="width"]')
    expect(progressBar).toHaveStyle({ width: '50%' })
  })

  it('renders progress bar with 100% width when all prompts completed', () => {
    // With 4 prompts total, all completed = bitmask 0b1111 = 15
    const allCompletedQualifications = QualificationsSchema.parse({
      v: VisaType.Engineer,
      completed: 0b1111,
      s: 'test-session',
    })

    const { container } = renderWithIntl(
      <VisaProgressBar
        config={testFormConfig}
        qualifications={allCompletedQualifications}
        doesQualify={true}
      />,
    )

    const progressBar = container.querySelector('[style*="width"]')
    expect(progressBar).toHaveStyle({ width: '100%' })
  })
})
