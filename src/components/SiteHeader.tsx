'use client'

import { useState } from 'react'
import { Logo } from '@components/Logo'
import { SettingsModal } from '@components/SettingsModal'
import {
  Bars3Icon,
  Cog6ToothIcon,
  HomeIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { usePathname } from 'next/navigation'

export function SiteHeader() {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const handleOpenSettings = () => {
    setIsMobileMenuOpen(false)
    setIsSettingsOpen(true)
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <header className="py-6 px-4 flex justify-between space-x-8 border-b-4 border-zinc-100/50 dark:border-zinc-900/50">
          <Link
            href={`/`}
            className="no-underline hover:opacity-60 transition-opacity"
          >
            <Logo />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <ul className="flex space-x-4 items-center justify-center h-full font-semibold text-lg">
              <li>
                <Link
                  href={`/`}
                  className={`no-underline ${isHomePage ? activeClass : inactiveClass}`}
                  aria-current={isHomePage ? 'page' : undefined}
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/about`}
                  className={`no-underline ${isAboutPage ? activeClass : inactiveClass}`}
                  aria-current={isAboutPage ? 'page' : undefined}
                >
                  {t('about')}
                </Link>
              </li>
            </ul>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-gray-50 transition-colors"
              aria-label={t('settings')}
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-gray-50 transition-colors"
            aria-label={t('menu')}
            aria-expanded={isMobileMenuOpen}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </header>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white dark:bg-zinc-900 z-50 transform transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4 border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-gray-50 transition-colors"
              aria-label={t('close')}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-lg font-medium transition-colors ${
                    isHomePage
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  aria-current={isHomePage ? 'page' : undefined}
                >
                  <HomeIcon className="w-5 h-5" />
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/about`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg no-underline text-lg font-medium transition-colors ${
                    isAboutPage
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  aria-current={isAboutPage ? 'page' : undefined}
                >
                  <InformationCircleIcon className="w-5 h-5" />
                  {t('about')}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleOpenSettings}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium transition-colors text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 w-full text-left"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  {t('settings')}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  )
}
