import { screen } from '@testing-library/react'

import { OutdatedStateError } from '@components/OutdatedStateError'
import { renderWithIntl } from '../test-utils/renderWithIntl'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('OutdatedStateError', () => {
  it('links back to the visa start page', () => {
    renderWithIntl(<OutdatedStateError visaSlug="engineer" />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/calculator/engineer')
  })

  it('renders the title text', () => {
    renderWithIntl(<OutdatedStateError visaSlug="engineer" />)

    expect(
      screen.getByRole('heading', { name: 'Calculator Updated' }),
    ).toBeInTheDocument()
  })

  it('renders the description text', () => {
    renderWithIntl(<OutdatedStateError visaSlug="engineer" />)

    expect(
      screen.getByText(
        'The immigration point system has been updated since you started this calculation. Please restart the calculator to ensure accurate results.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the restart button text', () => {
    renderWithIntl(<OutdatedStateError visaSlug="engineer" />)

    expect(screen.getByRole('link', { name: /Start Over/ })).toBeInTheDocument()
  })

  it('displays the calendar emoji', () => {
    renderWithIntl(<OutdatedStateError visaSlug="engineer" />)

    expect(screen.getByText('📅')).toBeInTheDocument()
  })
})
