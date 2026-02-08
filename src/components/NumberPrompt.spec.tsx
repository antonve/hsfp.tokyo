import { fireEvent, screen } from '@testing-library/react'

import { NumberPrompt } from '@components/NumberPrompt'
import { VisaType } from '@lib/domain'
import { QualificationsSchema } from '@lib/domain/qualifications'
import { formConfig as engineerForm } from '@lib/domain/visa.engineer'
import { withCompletedPrompt } from '@lib/domain/prompts'
import { renderWithIntl } from '../test-utils/renderWithIntl'

describe('NumberPrompt', () => {
  it('shows required validation error when submitting empty', () => {
    const onSubmit = jest.fn()
    const prompt = engineerForm.sections.job?.find(p => p.id === 'salary')
    expect(prompt).toBeTruthy()

    const qualifications = QualificationsSchema.parse({
      v: VisaType.Engineer,
      completed: 0,
      s: 'test-session',
    })

    renderWithIntl(
      <NumberPrompt
        qualifications={qualifications}
        visaType={VisaType.Engineer}
        section="job"
        prompt={prompt as any}
        overallPromptIndex={0}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText(/a value is required/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows min validation error when below min', () => {
    const onSubmit = jest.fn()
    const prompt = engineerForm.sections.job?.find(p => p.id === 'salary')
    expect(prompt).toBeTruthy()

    const base = QualificationsSchema.parse({
      v: VisaType.Engineer,
      completed: 0,
      s: 'test-session',
      salary: 2_999_999,
    })
    const qualifications = withCompletedPrompt(0, base)

    renderWithIntl(
      <NumberPrompt
        qualifications={qualifications}
        visaType={VisaType.Engineer}
        section="job"
        prompt={prompt as any}
        overallPromptIndex={0}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(
      screen.getByText(/should be more than 3,000,000/i),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows max validation error when above max', () => {
    const onSubmit = jest.fn()
    const prompt = engineerForm.sections.job?.find(p => p.id === 'experience')
    expect(prompt).toBeTruthy()

    const base = QualificationsSchema.parse({
      v: VisaType.Engineer,
      completed: 0,
      s: 'test-session',
      experience: 51,
    })
    const qualifications = withCompletedPrompt(0, base)

    renderWithIntl(
      <NumberPrompt
        qualifications={qualifications}
        visaType={VisaType.Engineer}
        section="job"
        prompt={prompt as any}
        overallPromptIndex={0}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(screen.getByText(/should be less than 50/i)).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid value (including changes) and marks prompt completed', () => {
    const onSubmit = jest.fn()
    const prompt = engineerForm.sections.job?.find(p => p.id === 'salary')
    expect(prompt).toBeTruthy()

    const base = QualificationsSchema.parse({
      v: VisaType.Engineer,
      completed: 0,
      s: 'test-session',
      salary: 3_000_000,
    })
    const qualifications = withCompletedPrompt(0, base)

    renderWithIntl(
      <NumberPrompt
        qualifications={qualifications}
        visaType={VisaType.Engineer}
        section="job"
        prompt={prompt as any}
        overallPromptIndex={0}
        onSubmit={onSubmit}
      />,
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '3100000' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    const updater = onSubmit.mock.calls[0][0]
    const updated = updater(qualifications)
    expect((updated as any).salary).toBe(3_100_000)
    expect(updated.completed & 1).toBe(1)
  })

  describe('isLoading state', () => {
    it('disables buttons when isLoading is true', () => {
      const onSubmit = jest.fn()
      const prompt = engineerForm.sections.job?.find(p => p.id === 'salary')
      expect(prompt).toBeTruthy()

      const qualifications = QualificationsSchema.parse({
        v: VisaType.Engineer,
        completed: 0,
        s: 'test-session',
      })

      renderWithIntl(
        <NumberPrompt
          qualifications={qualifications}
          visaType={VisaType.Engineer}
          section="job"
          prompt={prompt as any}
          overallPromptIndex={0}
          onSubmit={onSubmit}
          isLoading={true}
        />,
      )

      const continueButton = screen.getByRole('button', { name: /continue/i })
      const skipButton = screen.getByRole('button', { name: /skip|cannot/i })

      expect(continueButton).toBeDisabled()
      expect(skipButton).toBeDisabled()
    })

    it('shows loading spinner when isLoading is true', () => {
      const onSubmit = jest.fn()
      const prompt = engineerForm.sections.job?.find(p => p.id === 'salary')
      expect(prompt).toBeTruthy()

      const qualifications = QualificationsSchema.parse({
        v: VisaType.Engineer,
        completed: 0,
        s: 'test-session',
      })

      const { container } = renderWithIntl(
        <NumberPrompt
          qualifications={qualifications}
          visaType={VisaType.Engineer}
          section="job"
          prompt={prompt as any}
          overallPromptIndex={0}
          onSubmit={onSubmit}
          isLoading={true}
        />,
      )

      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })
})
