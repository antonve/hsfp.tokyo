import { screen } from '@testing-library/react'

import { VisaForm } from '@components/VisaForm'
import { formConfig as engineerForm } from '@lib/domain/visa.engineer'
import { renderWithIntl } from '../test-utils/renderWithIntl'

// Mock the hooks module
jest.mock('@lib/hooks', () => ({
  useQualifications: jest.fn(),
  useVisaFormProgress: jest.fn(),
  useIsStateOutdated: jest.fn(),
}))

// Mock next/link for OutdatedStateError
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock child components to isolate VisaForm tests
jest.mock('@components/VisaFormSection', () => ({
  VisaFormSection: ({ config }: any) => (
    <div data-testid="visa-form-section">
      <span data-testid="visa-type">{config.visaType}</span>
    </div>
  ),
}))

import {
  useQualifications,
  useVisaFormProgress,
  useIsStateOutdated,
} from '@lib/hooks'
import { VisaType } from '@lib/domain'
import { QualificationsSchema } from '@lib/domain/qualifications'

const mockUseQualifications = useQualifications as jest.Mock
const mockUseVisaFormProgress = useVisaFormProgress as jest.Mock
const mockUseIsStateOutdated = useIsStateOutdated as jest.Mock

describe('VisaForm', () => {
  const baseQualifications = QualificationsSchema.parse({
    v: VisaType.Engineer,
    completed: 0,
    s: 'test-session',
  })

  const defaultProgress = {
    section: 'education',
    promptIndex: 0,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseQualifications.mockReturnValue(baseQualifications)
    mockUseVisaFormProgress.mockReturnValue(defaultProgress)
    mockUseIsStateOutdated.mockReturnValue(false)
  })

  it('renders form container with VisaFormSection', () => {
    renderWithIntl(<VisaForm config={engineerForm} />)

    expect(screen.getByTestId('visa-form-section')).toBeInTheDocument()
  })

  it('shows OutdatedStateError when state is outdated', () => {
    mockUseIsStateOutdated.mockReturnValue(true)

    renderWithIntl(<VisaForm config={engineerForm} />)

    // Should not render VisaFormSection
    expect(screen.queryByTestId('visa-form-section')).not.toBeInTheDocument()

    // Should render OutdatedStateError with restart link
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/calculator/engineer',
    )
    expect(screen.getByRole('link', { name: /Start Over/ })).toBeInTheDocument()
  })

  it('renders VisaFormSection when state is not outdated', () => {
    mockUseIsStateOutdated.mockReturnValue(false)

    renderWithIntl(<VisaForm config={engineerForm} />)

    expect(screen.getByTestId('visa-form-section')).toBeInTheDocument()
    expect(screen.getByTestId('visa-type')).toHaveTextContent('engineer')
  })

  it('passes config to VisaFormSection', () => {
    renderWithIntl(<VisaForm config={engineerForm} />)

    expect(screen.getByTestId('visa-type')).toHaveTextContent(
      engineerForm.visaType,
    )
  })
})
