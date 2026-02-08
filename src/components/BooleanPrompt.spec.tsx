import { fireEvent, screen } from '@testing-library/react'

import { BooleanPrompt } from '@components/BooleanPrompt'
import { VisaType } from '@lib/domain'
import { BooleanPrompt as BooleanPromptType } from '@lib/domain/form'
import { QualificationsSchema } from '@lib/domain/qualifications'
import { formConfig as engineerForm } from '@lib/domain/visa.engineer'
import { renderWithIntl } from '../test-utils/renderWithIntl'

describe('BooleanPrompt', () => {
  const prompt = engineerForm.sections.education?.find(
    p => p.id === 'dual_degree',
  ) as BooleanPromptType | undefined

  const baseQualifications = QualificationsSchema.parse({
    v: VisaType.Engineer,
    completed: 0,
    s: 'test-session',
  })

  it('renders Yes/No options', () => {
    expect(prompt).toBeTruthy()
    const onSubmit = jest.fn()

    renderWithIntl(
      <BooleanPrompt
        qualifications={baseQualifications}
        visaType={VisaType.Engineer}
        section="education"
        prompt={prompt!}
        overallPromptIndex={1}
        onSubmit={onSubmit}
      />,
    )

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(2)

    expect(screen.getByText(/yes/i)).toBeInTheDocument()
    expect(screen.getByText(/no/i)).toBeInTheDocument()
  })

  it('selecting "Yes" calls the updater which returns true', () => {
    expect(prompt).toBeTruthy()
    const onSubmit = jest.fn()

    renderWithIntl(
      <BooleanPrompt
        qualifications={baseQualifications}
        visaType={VisaType.Engineer}
        section="education"
        prompt={prompt!}
        overallPromptIndex={1}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.click(screen.getByText(/yes/i))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)

    const updater = onSubmit.mock.calls[0][0]
    const updated = updater(baseQualifications)

    expect(updated.dual_degree).toBe(true)
    expect(updated.completed & 2).toBe(2)
  })

  it('selecting "No" calls the updater which returns undefined (not false)', () => {
    expect(prompt).toBeTruthy()
    const onSubmit = jest.fn()

    renderWithIntl(
      <BooleanPrompt
        qualifications={baseQualifications}
        visaType={VisaType.Engineer}
        section="education"
        prompt={prompt!}
        overallPromptIndex={1}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.click(screen.getByText(/no/i))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)

    const updater = onSubmit.mock.calls[0][0]
    const updated = updater(baseQualifications)

    expect(updated.dual_degree).toBeUndefined()
    expect(updated.dual_degree).not.toBe(false)
    expect(updated.completed & 2).toBe(2)
  })
})
