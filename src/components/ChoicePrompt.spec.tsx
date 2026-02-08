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

  describe('keyboard navigation', () => {
    it('pressing number keys selects the corresponding option', () => {
      const onSubmit = jest.fn()
      const prompt = engineerForm.sections.education?.find(
        p => p.id === 'degree',
      )
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

      // Press '1' to select the first option
      fireEvent.keyDown(window, { key: '1' })
      expect(radios[0]).toBeChecked()

      // Press '2' to select the second option
      fireEvent.keyDown(window, { key: '2' })
      expect(radios[1]).toBeChecked()
      expect(radios[0]).not.toBeChecked()

      // Press '3' to select the third option
      fireEvent.keyDown(window, { key: '3' })
      expect(radios[2]).toBeChecked()
      expect(radios[1]).not.toBeChecked()
    })

    it('arrow down navigates to the next option', () => {
      const onSubmit = jest.fn()
      const prompt = engineerForm.sections.education?.find(
        p => p.id === 'degree',
      )
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

      // Arrow down from no selection goes to first option
      fireEvent.keyDown(window, { key: 'ArrowDown' })
      expect(radios[0]).toBeChecked()

      // Arrow down again goes to second option
      fireEvent.keyDown(window, { key: 'ArrowDown' })
      expect(radios[1]).toBeChecked()
    })

    it('arrow up navigates to the previous option', () => {
      const onSubmit = jest.fn()
      const prompt = engineerForm.sections.education?.find(
        p => p.id === 'degree',
      )
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

      // First select the second option
      fireEvent.keyDown(window, { key: '2' })
      expect(radios[1]).toBeChecked()

      // Arrow up goes to first option
      fireEvent.keyDown(window, { key: 'ArrowUp' })
      expect(radios[0]).toBeChecked()
    })

    it('arrow navigation wraps around at boundaries', () => {
      const onSubmit = jest.fn()
      const prompt = engineerForm.sections.education?.find(
        p => p.id === 'degree',
      )
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
      const lastIndex = radios.length - 1

      // Select the first option
      fireEvent.keyDown(window, { key: '1' })
      expect(radios[0]).toBeChecked()

      // Arrow up from first option should wrap to last option
      fireEvent.keyDown(window, { key: 'ArrowUp' })
      expect(radios[lastIndex]).toBeChecked()

      // Arrow down from last option should wrap to first option
      fireEvent.keyDown(window, { key: 'ArrowDown' })
      expect(radios[0]).toBeChecked()
    })
  })
})
