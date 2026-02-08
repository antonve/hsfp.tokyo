import { screen } from '@testing-library/react'

import { VisaFormPrompt } from '@components/VisaFormPrompt'
import { VisaType } from '@lib/domain'
import { QualificationsSchema } from '@lib/domain/qualifications'
import { formConfig as engineerForm } from '@lib/domain/visa.engineer'
import { renderWithIntl } from '../test-utils/renderWithIntl'

describe('VisaFormPrompt', () => {
  const qualifications = QualificationsSchema.parse({
    v: VisaType.Engineer,
    completed: 0,
    s: 'test-session',
  })

  it('renders ChoicePrompt for CHOICE prompts', () => {
    const prompt = engineerForm.sections.education?.find(p => p.id === 'degree')
    expect(prompt).toBeTruthy()

    renderWithIntl(
      <VisaFormPrompt
        qualifications={qualifications}
        visaType={VisaType.Engineer}
        section="education"
        prompt={prompt!}
        overallPromptIndex={0}
        onSubmit={() => {}}
        isLoading={false}
      />,
    )

    expect(screen.getAllByRole('radio').length).toBeGreaterThan(0)
  })

  it('renders NumberPrompt for NUMBER prompts', () => {
    const prompt = engineerForm.sections.job?.find(p => p.id === 'salary')
    expect(prompt).toBeTruthy()

    renderWithIntl(
      <VisaFormPrompt
        qualifications={qualifications}
        visaType={VisaType.Engineer}
        section="job"
        prompt={prompt!}
        overallPromptIndex={0}
        onSubmit={() => {}}
        isLoading={false}
      />,
    )

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders BooleanPrompt (as a 2-option choice) for BOOLEAN prompts', () => {
    const prompt = engineerForm.sections.education?.find(
      p => p.id === 'dual_degree',
    )
    expect(prompt).toBeTruthy()

    renderWithIntl(
      <VisaFormPrompt
        qualifications={qualifications}
        visaType={VisaType.Engineer}
        section="education"
        prompt={prompt!}
        overallPromptIndex={0}
        onSubmit={() => {}}
        isLoading={false}
      />,
    )

    expect(screen.getAllByRole('radio')).toHaveLength(2)
  })
})
