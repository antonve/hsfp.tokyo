'use client'

import { useState } from 'react'
import { Logo } from '@components/Logo'
import { SettingsModal } from '@components/SettingsModal'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { usePathname } from 'next/navigation'

export function SiteHeader() {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Hide header on calculator form pages, but show on intro and results pages
  const isIntroPage = pathname.match(/\/calculator\/[^/]+$/)
  const isResultsPage = pathname.endsWith('/results')
  const shouldHideHeader =
    pathname.includes('/calculator/') && !isResultsPage && !isIntroPage

  // Check active nav state (pathname includes locale prefix like /en)
  const isHomePage = pathname === '/' || pathname.match(/^\/[a-z]{2}$/)
  const isAboutPage = pathname.endsWith('/about')

  const activeClass = 'border-b-2 border-emerald-400/80 hover:border-white/40'
  const inactiveClass = 'hover:opacity-70'

  if (shouldHideHeader) {
    return null
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <header className="py-6 px-4 flex justify-between space-x-8 border-b-4 border-surface-secondary/50">
          <Link
            href={`/`}
            className="no-underline hover:opacity-60 transition-opacity"
          >
            <Logo />
          </Link>
          <nav className="flex items-center gap-4">
            <ul className="flex space-x-4 items-center justify-center h-full font-semibold text-lg">
              <li>
                <Link
                  href={`/`}
                  className={`no-underline ${isHomePage ? activeClass : inactiveClass}`}
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/about`}
                  className={`no-underline ${isAboutPage ? activeClass : inactiveClass}`}
                >
                  {t('about')}
                </Link>
              </li>
            </ul>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-content-muted hover:text-content-primary transition-colors"
              aria-label={t('settings')}
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </button>
          </nav>
        </header>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  )
}
