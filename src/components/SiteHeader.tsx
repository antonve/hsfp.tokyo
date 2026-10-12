'use client'

import { useState } from 'react'
import { Logo } from '@components/Logo'
import { SettingsModal } from '@components/SettingsModal'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Link } from '@lib/i18n/navigation'

export function SiteHeader() {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Hide header on calculator form pages, but show on intro and results pages
  const isIntroPage = pathname.match(/\/calculator\/[^/]+$/)
  const isResultsPage = pathname.endsWith('/results')
  const shouldHideHeader =
    pathname.includes('/calculator/') && !isResultsPage && !isIntroPage

  if (shouldHideHeader) {
    return null
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <header className="min-h-[100px] py-6 flex items-center justify-between gap-8 border-b-4 border-zinc-100/50 dark:border-zinc-900/50 leading-[1.6] antialiased">
          <Link
            href="/"
            className="no-underline hover:opacity-60 transition-opacity focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            <Logo />
          </Link>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="-m-2 p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-gray-50 focus-visible:outline-2 focus-visible:outline-emerald-400"
            aria-label={t('settings')}
          >
            <Cog6ToothIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </header>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  )
}
