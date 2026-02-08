import { fireEvent, screen } from '@testing-library/react'

import { BooleanPrompt } from '@components/BooleanPrompt'
import { VisaType } from '@lib/domain'
import { QualificationsSchema } from '@lib/domain/qualifications'
import messagesEn from '@lib/i18n/messages/en.json'
import { renderWithIntl } from '../test-utils/renderWithIntl'

const testMessages = {
  ...messagesEn,
  visa_form: {
    ...messagesEn.visa_form,
    engineer: {
      ...messagesEn.visa_form.engineer,
      sections: {
        ...messagesEn.visa_form.engineer.sections,
        education: {
          ...messagesEn.visa_form.engineer.sections.education,
          testBoolean: {
            prompt: 'Test boolean prompt',
            options: {
              true: 'Yes',
              false: 'No',
            },
          },
        },
      },
    },
  },
}

describe('BooleanPrompt', () => {
  const mockPrompt = { id: 'testBoolean', type: 'BOOLEAN' as const }

  const baseQualifications = QualificationsSchema.parse({
    v: VisaType.Engineer,
    completed: 0,
    s: 'test-session',
  })

  it('renders Yes/No options', () => {
    const onSubmit = jest.fn()

    renderWithIntl(
      <BooleanPrompt
        qualifications={baseQualifications}
        visaType={VisaType.Engineer}
        section="education"
        prompt={mockPrompt}
        overallPromptIndex={0}
        onSubmit={onSubmit}
      />,
      { messages: testMessages },
    )

    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(2)

    expect(screen.getByText(/yes/i)).toBeInTheDocument()
    expect(screen.getByText(/no/i)).toBeInTheDocument()
  })

  it('selecting "Yes" calls the updater which returns true', () => {
    const onSubmit = jest.fn()

    renderWithIntl(
      <BooleanPrompt
        qualifications={baseQualifications}
        visaType={VisaType.Engineer}
        section="education"
        prompt={mockPrompt}
        overallPromptIndex={0}
        onSubmit={onSubmit}
      />,
      { messages: testMessages },
    )

    fireEvent.click(screen.getByText(/yes/i))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)

    const updater = onSubmit.mock.calls[0][0]
    const updated = updater(baseQualifications)

    expect((updated as any).testBoolean).toBe(true)
    expect(updated.completed & 1).toBe(1)
  })

  it('selecting "No" calls the updater which returns undefined (not false)', () => {
    const onSubmit = jest.fn()

    renderWithIntl(
      <BooleanPrompt
        qualifications={baseQualifications}
        visaType={VisaType.Engineer}
        section="education"
        prompt={mockPrompt}
        overallPromptIndex={0}
        onSubmit={onSubmit}
      />,
      { messages: testMessages },
    )

    fireEvent.click(screen.getByText(/no/i))
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(onSubmit).toHaveBeenCalledTimes(1)

    const updater = onSubmit.mock.calls[0][0]
    const updated = updater(baseQualifications)

    expect((updated as any).testBoolean).toBeUndefined()
    expect((updated as any).testBoolean).not.toBe(false)
    expect(updated.completed & 1).toBe(1)
  })
})
