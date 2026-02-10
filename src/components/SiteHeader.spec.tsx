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

  describe('renders logo and navigation links', () => {
    it('renders the logo with HSFP.tokyo text', () => {
      renderWithIntl(<SiteHeader />)

      expect(screen.getByText('HSFP')).toBeInTheDocument()
      expect(screen.getByText('tokyo')).toBeInTheDocument()
    })

    it('renders desktop navigation links', () => {
      renderWithIntl(<SiteHeader />)

      const homeLinks = screen.getAllByRole('link', { name: /home/i })
      const aboutLinks = screen.getAllByRole('link', { name: /about/i })

      expect(homeLinks.length).toBeGreaterThan(0)
      expect(aboutLinks.length).toBeGreaterThan(0)
    })
  })

  describe('mobile menu toggle', () => {
    it('opens mobile menu when hamburger button is clicked', () => {
      renderWithIntl(<SiteHeader />)

      const menuButton = screen.getByRole('button', { name: /^menu$/i })
      fireEvent.click(menuButton)

      const closeButton = screen.getByRole('button', { name: /close menu/i })
      expect(closeButton).toBeInTheDocument()
    })

    it('closes mobile menu when close button is clicked', () => {
      renderWithIntl(<SiteHeader />)

      const menuButton = screen.getByRole('button', { name: /^menu$/i })
      fireEvent.click(menuButton)

      const closeButton = screen.getByRole('button', { name: /close menu/i })
      fireEvent.click(closeButton)

      const sidebar = document.querySelector('aside')
      expect(sidebar).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('settings button', () => {
    it('settings button is present in desktop nav', () => {
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

    it('opens settings from mobile menu and closes menu', () => {
      renderWithIntl(<SiteHeader />)

      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: /^menu$/i })
      fireEvent.click(menuButton)

      // Click settings in mobile menu
      const settingsButtons = screen.getAllByRole('button', {
        name: /settings/i,
      })
      const mobileSettingsButton = settingsButtons[settingsButtons.length - 1]
      fireEvent.click(mobileSettingsButton)

      // Settings modal should be open
      expect(screen.getByTestId('settings-modal')).toBeInTheDocument()

      // Mobile menu should be closed
      const sidebar = document.querySelector('aside')
      expect(sidebar).toHaveAttribute('aria-hidden', 'true')
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

  describe('active route styling', () => {
    it('marks active nav link with aria-current="page" on home page', () => {
      mockUsePathname.mockReturnValue('/')

      renderWithIntl(<SiteHeader />)

      const homeLinks = screen.getAllByRole('link', { name: /home/i })
      expect(homeLinks[0]).toHaveAttribute('aria-current', 'page')

      const aboutLinks = screen.getAllByRole('link', { name: /about/i })
      expect(aboutLinks[0]).not.toHaveAttribute('aria-current')
    })

    it('marks active nav link with aria-current="page" on about page', () => {
      mockUsePathname.mockReturnValue('/en/about')

      renderWithIntl(<SiteHeader />)

      const aboutLinks = screen.getAllByRole('link', { name: /about/i })
      expect(aboutLinks[0]).toHaveAttribute('aria-current', 'page')

      const homeLinks = screen.getAllByRole('link', { name: /home/i })
      expect(homeLinks[0]).not.toHaveAttribute('aria-current')
    })
  })
})
