import { fireEvent, screen } from '@testing-library/react'

import { ChoicePrompt } from '@components/ChoicePrompt'
import { VisaType } from '@lib/domain'
import { QualificationsSchema } from '@lib/domain/qualifications'
import { formConfig as engineerForm } from '@lib/domain/visa.engineer'
import { renderWithIntl } from '../test-utils/renderWithIntl'

describe('ChoicePrompt', () => {
  it('shows validation error when submitting with no selection', () => {
    const onSubmit = jest.fn()
    const prompt = engineerForm.sections.education?.find(p => p.id === 'degree')
    expect(prompt).toBeTruthy()

    const qualifications = QualificationsSchema.parse({
      v: VisaType.Engineer,
      completed: 0,
      s: 'test-session',
    })

    renderWithIntl(
      <ChoicePrompt
        qualifications={qualifications}
        visaType={VisaType.Engineer}
        section="education"
        prompt={prompt as any}
        overallPromptIndex={0}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(
      screen.getByText(/please select an option, or skip this question/i),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with an updater that sets the selected value and marks prompt completed', () => {
    const onSubmit = jest.fn()
    const prompt = engineerForm.sections.education?.find(p => p.id === 'degree')
    expect(prompt).toBeTruthy()

    const qualifications = QualificationsSchema.parse({
      v: VisaType.Engineer,
      completed: 0,
      s: 'test-session',
    })

    renderWithIntl(
      <ChoicePrompt
        qualifications={qualifications}
        visaType={VisaType.Engineer}
        section="education"
        prompt={prompt as any}
        overallPromptIndex={0}
        onSubmit={onSubmit}
      />,
    )

    const radios = screen.getAllByRole('radio')
    expect(radios.length).toBeGreaterThan(0)
    fireEvent.click(radios[0])

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(onSubmit).toHaveBeenCalledTimes(1)

    const updater = onSubmit.mock.calls[0][0]
    const updated = updater(qualifications)

    const firstOption = (prompt as any).options[0]
    expect((updated as any).degree).toBe(firstOption)
    expect(updated.completed & 1).toBe(1)
  })

  it('skip calls onSubmit with an updater that marks prompt completed but does not set a value', () => {
    const onSubmit = jest.fn()
    const prompt = engineerForm.sections.education?.find(p => p.id === 'degree')
    expect(prompt).toBeTruthy()

    const qualifications = QualificationsSchema.parse({
      v: VisaType.Engineer,
      completed: 0,
      s: 'test-session',
    })

    renderWithIntl(
      <ChoicePrompt
        qualifications={qualifications}
        visaType={VisaType.Engineer}
        section="education"
        prompt={prompt as any}
        overallPromptIndex={0}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /skip/i }))
    expect(onSubmit).toHaveBeenCalledTimes(1)

    const updater = onSubmit.mock.calls[0][0]
    const updated = updater(qualifications)

    expect((updated as any).degree).toBeUndefined()
    expect(updated.completed & 1).toBe(1)
  })
})
