import { fireEvent, screen } from '@testing-library/react'

import { SiteHeader } from '@components/SiteHeader'
import { renderWithIntl } from '../../test-utils/renderWithIntl'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

jest.mock('next-intl/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
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

    it('navigation links have correct hrefs', () => {
      renderWithIntl(<SiteHeader />)

      const homeLinks = screen.getAllByRole('link', { name: /home/i })
      const aboutLinks = screen.getAllByRole('link', { name: /about/i })

      expect(homeLinks[0]).toHaveAttribute('href', '/')
      expect(aboutLinks[0]).toHaveAttribute('href', '/about')
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

      // The sidebar should be translated off-screen (translate-x-full class)
      const sidebar = document.querySelector('aside')
      expect(sidebar).toHaveClass('translate-x-full')
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
      expect(sidebar).toHaveClass('translate-x-full')
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
    it('applies active styling to home link on home page', () => {
      mockUsePathname.mockReturnValue('/')

      renderWithIntl(<SiteHeader />)

      const homeLinks = screen.getAllByRole('link', { name: /home/i })
      // Desktop navigation link (first one)
      expect(homeLinks[0]).toHaveClass('border-b-2')
    })

    it('applies active styling to about link on about page', () => {
      mockUsePathname.mockReturnValue('/en/about')

      renderWithIntl(<SiteHeader />)

      const aboutLinks = screen.getAllByRole('link', { name: /about/i })
      // Desktop navigation link (first one)
      expect(aboutLinks[0]).toHaveClass('border-b-2')
    })
  })
})
