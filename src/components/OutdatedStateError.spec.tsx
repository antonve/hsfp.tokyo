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
})
