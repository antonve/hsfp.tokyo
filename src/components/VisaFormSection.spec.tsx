import { fireEvent, screen } from '@testing-library/react'

import { VisaFormSection } from '@components/VisaFormSection'
import { VisaType } from '@lib/domain'
import { VisaProgress } from '@lib/domain/form'
import { QualificationsSchema } from '@lib/domain/qualifications'
import { formConfig as engineerForm } from '@lib/domain/visa.engineer'
import { renderWithIntl } from '../test-utils/renderWithIntl'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({
    locale: 'en',
    visa: 'engineer',
  }),
}))

jest.mock('@lib/hooks', () => ({
  useLanguage: () => 'en',
}))

describe('VisaFormSection', () => {
  const baseQualifications = QualificationsSchema.parse({
    v: VisaType.Engineer,
    completed: 0,
    s: 'test-session',
  })

  beforeEach(() => {
    mockPush.mockClear()
  })

  describe('renders section with prompts', () => {
    it('renders the prompt heading from translations', () => {
      const progress: VisaProgress = { section: 'education', promptIndex: 0 }

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={baseQualifications}
        />,
      )

      expect(
        screen.getByRole('heading', {
          name: /what is your highest degree/i,
        }),
      ).toBeInTheDocument()
    })

    it('renders max points hint when prompt has maxPoints', () => {
      const progress: VisaProgress = { section: 'education', promptIndex: 0 }

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={baseQualifications}
        />,
      )

      expect(screen.getByText(/up to 30 points/i)).toBeInTheDocument()
    })

    it('renders the VisaFormPrompt component', () => {
      const progress: VisaProgress = { section: 'education', promptIndex: 0 }

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={baseQualifications}
        />,
      )

      // ChoicePrompt should render radio buttons for degree question
      expect(screen.getAllByRole('radio').length).toBeGreaterThan(0)
    })

    it('renders the skip all and view results button', () => {
      const progress: VisaProgress = { section: 'education', promptIndex: 0 }

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={baseQualifications}
        />,
      )

      expect(
        screen.getByRole('button', { name: /skip all.*view result/i }),
      ).toBeInTheDocument()
    })
  })

  describe('form submission behavior', () => {
    it('navigates to the next prompt on form submission', () => {
      const progress: VisaProgress = { section: 'education', promptIndex: 0 }

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={baseQualifications}
        />,
      )

      // Select an option
      const radios = screen.getAllByRole('radio')
      fireEvent.click(radios[0])

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/\/en\/calculator\/engineer\/.*education\/2/),
      )
    })

    it('navigates to the next section when completing the last prompt in a section', () => {
      // Education section has 2 prompts (degree, dual_degree)
      const progress: VisaProgress = { section: 'education', promptIndex: 1 }

      // Set degree so dual_degree question applies
      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        degree: 'master',
        completed: 1,
      })

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={qualifications}
        />,
      )

      // Select "Yes" option
      fireEvent.click(screen.getByText(/yes/i))
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      expect(mockPush).toHaveBeenCalledTimes(1)
      // Should navigate to job section (next in order)
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/\/en\/calculator\/engineer\/.*\/1/),
      )
    })

    it('navigates to results page when clicking skip all button', () => {
      const progress: VisaProgress = { section: 'education', promptIndex: 0 }

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={baseQualifications}
        />,
      )

      fireEvent.click(
        screen.getByRole('button', { name: /skip all.*view result/i }),
      )

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/\/en\/calculator\/engineer\/results\?q=/),
      )
    })
  })

  describe('keyboard navigation', () => {
    it('pressing ArrowRight skips to next question', () => {
      const progress: VisaProgress = { section: 'education', promptIndex: 0 }

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={baseQualifications}
        />,
      )

      fireEvent.keyDown(window, { key: 'ArrowRight' })

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/\/en\/calculator\/engineer\/.*education\/2/),
      )
    })

    it('pressing ArrowLeft goes to previous question', () => {
      const progress: VisaProgress = { section: 'education', promptIndex: 1 }

      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        completed: 1,
      })

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={qualifications}
        />,
      )

      fireEvent.keyDown(window, { key: 'ArrowLeft' })

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/\/en\/calculator\/engineer\/education\/1/),
      )
    })

    it('pressing ArrowLeft on first question does nothing', () => {
      const progress: VisaProgress = { section: 'education', promptIndex: 0 }

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={baseQualifications}
        />,
      )

      fireEvent.keyDown(window, { key: 'ArrowLeft' })

      expect(mockPush).not.toHaveBeenCalled()
    })

    it('pressing Enter submits the form', () => {
      const progress: VisaProgress = { section: 'education', promptIndex: 0 }

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={baseQualifications}
        />,
      )

      // Select an option first
      const radios = screen.getAllByRole('radio')
      fireEvent.click(radios[0])

      // Press Enter to submit
      fireEvent.keyDown(window, { key: 'Enter' })

      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/\/en\/calculator\/engineer/),
      )
    })

    it('ArrowRight does not skip when focus is on text input', () => {
      // Job section has NumberPrompt (salary) which has a text input
      const progress: VisaProgress = { section: 'job', promptIndex: 2 }

      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        completed: 0b111111, // Mark previous prompts as completed
      })

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={qualifications}
        />,
      )

      const input = screen.getByRole('textbox')

      // Simulate ArrowRight with target being the text input
      fireEvent.keyDown(input, { key: 'ArrowRight' })

      // Should not navigate when typing in text input
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('handles prompt completion state', () => {
    it('shows pre-filled value when prompt was previously completed', () => {
      const progress: VisaProgress = { section: 'education', promptIndex: 0 }

      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        degree: 'master',
        completed: 1, // Bit 0 set = first prompt completed
      })

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={qualifications}
        />,
      )

      const radios = screen.getAllByRole('radio')

      // Find the index of 'master' option
      const prompt = engineerForm.sections.education?.find(
        p => p.id === 'degree',
      )
      const masterIndex =
        prompt?.type === 'CHOICE' ? prompt.options.indexOf('master') : -1

      expect(radios[masterIndex]).toBeChecked()
    })

    it('renders BOOLEAN prompt with Yes/No options', () => {
      const booleanProgress: VisaProgress = {
        section: 'education',
        promptIndex: 1,
      }

      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        completed: 1,
      })

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={booleanProgress}
          qualifications={qualifications}
        />,
      )

      // BooleanPrompt should render 2 radio buttons for Yes/No
      const radios = screen.getAllByRole('radio')
      expect(radios).toHaveLength(2)
      expect(screen.getByText(/^yes$/i)).toBeInTheDocument()
      expect(screen.getByText(/^no$/i)).toBeInTheDocument()
    })

    it('renders NUMBER prompt with text input', () => {
      const numberProgress: VisaProgress = { section: 'job', promptIndex: 0 }

      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        completed: 1,
      })

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={numberProgress}
          qualifications={qualifications}
        />,
      )

      // NumberPrompt should show a textbox
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('FAQ section', () => {
    it('renders FAQ section when prompt has faqCount', () => {
      // dual_degree has faqCount: 2
      const progress: VisaProgress = { section: 'education', promptIndex: 1 }

      const qualifications = QualificationsSchema.parse({
        ...baseQualifications,
        completed: 1,
      })

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={qualifications}
        />,
      )

      expect(
        screen.getByRole('heading', { name: /frequently asked questions/i }),
      ).toBeInTheDocument()
    })

    it('does not render FAQ section when prompt has no faqCount', () => {
      // degree has no faqCount
      const progress: VisaProgress = { section: 'education', promptIndex: 0 }

      renderWithIntl(
        <VisaFormSection
          config={engineerForm}
          progress={progress}
          qualifications={baseQualifications}
        />,
      )

      expect(
        screen.queryByRole('heading', { name: /frequently asked questions/i }),
      ).not.toBeInTheDocument()
    })
  })
})
