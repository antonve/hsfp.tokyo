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

  it('applies emerald color when doesQualify is true', () => {
    const { container } = renderWithIntl(
      <VisaProgressBar
        config={testFormConfig}
        qualifications={baseQualifications}
        doesQualify={true}
      />,
    )

    const progressBar = container.querySelector('[style*="width"]')
    expect(progressBar).toHaveClass('bg-emerald-500')
  })

  it('applies zinc color when doesQualify is false', () => {
    const { container } = renderWithIntl(
      <VisaProgressBar
        config={testFormConfig}
        qualifications={baseQualifications}
        doesQualify={false}
      />,
    )

    const progressBar = container.querySelector('[style*="width"]')
    expect(progressBar).toHaveClass('bg-zinc-900')
  })

  it('rounds up percentage with Math.ceil', () => {
    // With 4 prompts, completing 1 = 25% (exactly, no rounding needed)
    // Completing 1 out of 3 would be 33.33% -> 34%
    // Let's use a config with 3 prompts
    const threePromptConfig: FormConfig = {
      visaType: VisaType.Engineer,
      sections: {
        education: [
          {
            id: 'degree',
            type: 'CHOICE',
            options: ['doctor', 'master', 'none'],
          },
          { id: 'dual_degree', type: 'BOOLEAN' },
          { id: 'extra', type: 'BOOLEAN' },
        ],
      },
      order: ['education'],
    }

    // Completing 1 out of 3 prompts = 33.33% -> should ceil to 34%
    const oneCompletedQualifications = QualificationsSchema.parse({
      v: VisaType.Engineer,
      completed: 0b1,
      s: 'test-session',
    })

    const { container } = renderWithIntl(
      <VisaProgressBar
        config={threePromptConfig}
        qualifications={oneCompletedQualifications}
        doesQualify={false}
      />,
    )

    const progressBar = container.querySelector('[style*="width"]')
    expect(progressBar).toHaveStyle({ width: '34%' })
  })

  it('handles edge case with empty form config', () => {
    const emptyFormConfig: FormConfig = {
      visaType: VisaType.Engineer,
      sections: {},
      order: [],
    }

    const { container } = renderWithIntl(
      <VisaProgressBar
        config={emptyFormConfig}
        qualifications={baseQualifications}
        doesQualify={false}
      />,
    )

    const progressBar = container.querySelector('[style*="width"]')
    expect(progressBar).toHaveStyle({ width: '0%' })
  })
})
