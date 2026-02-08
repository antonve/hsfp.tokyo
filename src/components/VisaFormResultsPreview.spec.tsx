import { screen } from '@testing-library/react'

import { VisaFormResultsPreview } from '@components/VisaFormResultsPreview'
import { renderWithIntl } from '../test-utils/renderWithIntl'

describe('VisaFormResultsPreview', () => {
  it('displays the points value correctly', () => {
    renderWithIntl(<VisaFormResultsPreview points={85} doesQualify={true} />)

    expect(screen.getByText('85')).toBeInTheDocument()
    expect(screen.getByText(/points/)).toBeInTheDocument()
  })

  it('shows emerald styling when doesQualify is true', () => {
    const { container } = renderWithIntl(
      <VisaFormResultsPreview points={75} doesQualify={true} />,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('bg-emerald-100')
    expect(wrapper).toHaveClass('text-emerald-800')
  })

  it('shows neutral styling when doesQualify is false', () => {
    const { container } = renderWithIntl(
      <VisaFormResultsPreview points={50} doesQualify={false} />,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('bg-zinc-100/50')
    expect(wrapper).not.toHaveClass('bg-emerald-100')
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

  it('displays various point values correctly', () => {
    const { rerender } = renderWithIntl(
      <VisaFormResultsPreview points={0} doesQualify={false} />,
    )
    expect(screen.getByText('0')).toBeInTheDocument()

    rerender(<VisaFormResultsPreview points={100} doesQualify={true} />)
    expect(screen.getByText('100')).toBeInTheDocument()

    rerender(<VisaFormResultsPreview points={70} doesQualify={true} />)
    expect(screen.getByText('70')).toBeInTheDocument()
  })
})
