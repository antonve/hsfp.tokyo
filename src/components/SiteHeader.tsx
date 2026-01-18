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

  // Hide header only on calculator form pages, not on results page
  const shouldHideHeader =
    pathname.includes('/calculator/') && !pathname.endsWith('/results')

  if (shouldHideHeader) {
    return null
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <header className="py-6 px-4 flex justify-between space-x-8 border-b-4 border-zinc-900/50">
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
                  className="no-underline border-b-2 border-emerald-400/80 hover:border-white/40"
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href={`/about`} className="no-underline">
                  {t('about')}
                </Link>
              </li>
            </ul>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-zinc-400 hover:text-zinc-200 transition-colors"
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
