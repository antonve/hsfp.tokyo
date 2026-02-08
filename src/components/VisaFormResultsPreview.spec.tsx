import { screen } from '@testing-library/react'

import { VisaFormResultsPreview } from '@components/VisaFormResultsPreview'
import { renderWithIntl } from '../test-utils/renderWithIntl'

describe('VisaFormResultsPreview', () => {
  it('displays the points value correctly', () => {
    renderWithIntl(<VisaFormResultsPreview points={85} doesQualify={true} />)

    expect(screen.getByText('85')).toBeInTheDocument()
    expect(screen.getByText(/points/)).toBeInTheDocument()
  })

  it('renders correct text for qualified state', () => {
    renderWithIntl(<VisaFormResultsPreview points={80} doesQualify={true} />)

    expect(
      screen.getByText('Congrats, you qualify for the visa!'),
    ).toBeInTheDocument()
  })

  it('renders correct text for not qualified state', () => {
    renderWithIntl(<VisaFormResultsPreview points={50} doesQualify={false} />)

    expect(
      screen.getByText('You need at least 70 points to qualify'),
    ).toBeInTheDocument()
  })
})
