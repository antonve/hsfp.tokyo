import { fireEvent, screen } from '@testing-library/react'

import { SiteHeader } from '@components/SiteHeader'
import { renderWithIntl } from '../test-utils/renderWithIntl'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

jest.mock('@components/SettingsModal', () => ({
  SettingsModal: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="settings-modal">
        <button onClick={onClose}>Close Settings</button>
      </div>
    ) : null,
}))

const mockUsePathname = jest.requireMock('next/navigation').usePathname

describe('SiteHeader', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  describe('renders logo', () => {
    it('renders the logo with HSFP.tokyo text', () => {
      renderWithIntl(<SiteHeader />)

      expect(screen.getByText('HSFP')).toBeInTheDocument()
      expect(screen.getByText('tokyo')).toBeInTheDocument()
    })
  })

  describe('settings button', () => {
    it('settings button is present', () => {
      renderWithIntl(<SiteHeader />)

      const settingsButtons = screen.getAllByRole('button', {
        name: /settings/i,
      })
      expect(settingsButtons.length).toBeGreaterThan(0)
    })

    it('opens settings modal when settings button is clicked', () => {
      renderWithIntl(<SiteHeader />)

      const settingsButtons = screen.getAllByRole('button', {
        name: /settings/i,
      })
      fireEvent.click(settingsButtons[0])

      expect(screen.getByTestId('settings-modal')).toBeInTheDocument()
    })
  })

  describe('header visibility', () => {
    it('hides header on calculator form pages', () => {
      mockUsePathname.mockReturnValue('/en/calculator/engineer/education')

      const { container } = renderWithIntl(<SiteHeader />)

      expect(container.querySelector('header')).not.toBeInTheDocument()
    })

    it('shows header on calculator intro pages', () => {
      mockUsePathname.mockReturnValue('/en/calculator/engineer')

      renderWithIntl(<SiteHeader />)

      expect(screen.getByText('HSFP')).toBeInTheDocument()
    })

    it('shows header on results pages', () => {
      mockUsePathname.mockReturnValue('/en/calculator/engineer/results')

      renderWithIntl(<SiteHeader />)

      expect(screen.getByText('HSFP')).toBeInTheDocument()
    })
  })
})
