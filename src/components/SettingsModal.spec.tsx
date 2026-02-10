import { fireEvent, screen, waitFor, act } from '@testing-library/react'

import { SettingsModal } from '@components/SettingsModal'
import { renderWithIntl } from '../test-utils/renderWithIntl'

jest.mock('next/navigation', () => ({
  usePathname: () => '/en/calculator/engineer',
  useSearchParams: () => ({
    toString: () => '',
  }),
}))

const mockSetTheme = jest.fn()
jest.mock('@lib/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: mockSetTheme,
  }),
}))

describe('SettingsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('renders when isOpen=true', async () => {
    const onClose = jest.fn()
    await act(async () => {
      renderWithIntl(<SettingsModal isOpen={true} onClose={onClose} />)
    })

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('does not render dialog content when isOpen=false', async () => {
    const onClose = jest.fn()
    await act(async () => {
      renderWithIntl(<SettingsModal isOpen={false} onClose={onClose} />)
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('close button calls onClose', async () => {
    const onClose = jest.fn()
    await act(async () => {
      renderWithIntl(<SettingsModal isOpen={true} onClose={onClose} />)
    })

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '' }))
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders all 4 language options', async () => {
    const onClose = jest.fn()
    await act(async () => {
      renderWithIntl(<SettingsModal isOpen={true} onClose={onClose} />)
    })

    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument()
    })
    expect(screen.getByText('日本語')).toBeInTheDocument()
    expect(screen.getByText('简体中文')).toBeInTheDocument()
    expect(screen.getByText('繁體中文')).toBeInTheDocument()
  })

  it('language links have correct href with locale preserving path', async () => {
    const onClose = jest.fn()
    await act(async () => {
      renderWithIntl(<SettingsModal isOpen={true} onClose={onClose} />)
    })

    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument()
    })

    const englishLink = screen.getByText('English').closest('a')
    const japaneseLink = screen.getByText('日本語').closest('a')

    // In production, localePrefix: 'as-needed' omits /en prefix.
    // In Jest mock environment, the prefix is included.
    expect(englishLink).toHaveAttribute('href', '/en/calculator/engineer')
    expect(japaneseLink).toHaveAttribute('href', '/ja/calculator/engineer')
  })

  it('renders theme toggle buttons', async () => {
    const onClose = jest.fn()
    await act(async () => {
      renderWithIntl(<SettingsModal isOpen={true} onClose={onClose} />)
    })

    await waitFor(() => {
      expect(screen.getByText('Dark')).toBeInTheDocument()
    })
    expect(screen.getByText('Light')).toBeInTheDocument()
  })

  it('clicking Dark theme button calls setTheme with dark', async () => {
    const onClose = jest.fn()
    await act(async () => {
      renderWithIntl(<SettingsModal isOpen={true} onClose={onClose} />)
    })

    await waitFor(() => {
      expect(screen.getByText('Dark')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Dark'))
    })

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('clicking Light theme button calls setTheme with light', async () => {
    const onClose = jest.fn()
    await act(async () => {
      renderWithIntl(<SettingsModal isOpen={true} onClose={onClose} />)
    })

    await waitFor(() => {
      expect(screen.getByText('Light')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Light'))
    })

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('clear data button shows confirmation on first click', async () => {
    const onClose = jest.fn()
    await act(async () => {
      renderWithIntl(<SettingsModal isOpen={true} onClose={onClose} />)
    })

    await waitFor(() => {
      expect(screen.getByText('Clear All Local Data')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Clear All Local Data'))
    })

    expect(screen.getByText('Click again to confirm')).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('second click clears localStorage and closes modal', async () => {
    const onClose = jest.fn()

    localStorage.setItem('hsfp-evidence-test', 'value1')
    localStorage.setItem('hsfp-evidence-other', 'value2')
    localStorage.setItem('other-key', 'value3')

    await act(async () => {
      renderWithIntl(<SettingsModal isOpen={true} onClose={onClose} />)
    })

    await waitFor(() => {
      expect(screen.getByText('Clear All Local Data')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Clear All Local Data'))
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Click again to confirm'))
    })

    expect(localStorage.getItem('hsfp-evidence-test')).toBeNull()
    expect(localStorage.getItem('hsfp-evidence-other')).toBeNull()
    expect(localStorage.getItem('other-key')).toBe('value3')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clicking language link calls onClose', async () => {
    const onClose = jest.fn()
    await act(async () => {
      renderWithIntl(<SettingsModal isOpen={true} onClose={onClose} />)
    })

    await waitFor(() => {
      expect(screen.getByText('日本語')).toBeInTheDocument()
    })

    await act(async () => {
      fireEvent.click(screen.getByText('日本語'))
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
