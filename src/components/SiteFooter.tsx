'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Link } from '@lib/i18n/navigation'

export function SiteFooter() {
  const pathname = usePathname()
  const t = useTranslations('footer')

  // Hide footer on calculator form pages, but show on intro and results pages
  const isIntroPage = pathname.match(/\/calculator\/[^/]+$/)
  const isResultsPage = pathname.endsWith('/results')
  const shouldHideFooter =
    pathname.includes('/calculator/') && !isResultsPage && !isIntroPage

  if (shouldHideFooter) {
    return null
  }

  return (
    <footer className="max-w-7xl mx-auto py-8 px-4 border-t-4 border-zinc-100/50 dark:border-zinc-900/50">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm leading-[1.6] antialiased text-zinc-500 dark:text-zinc-400">
        <Link
          href="/about"
          className="hover:text-zinc-900 hover:underline dark:hover:text-gray-50 focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          {t('sources_contact')}
        </Link>
        <Link
          href="/privacy"
          className="hover:text-zinc-900 hover:underline dark:hover:text-gray-50 focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          {t('privacy')}
        </Link>
        <a
          href="https://github.com/antonve/hsfp.tokyo"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-900 hover:underline dark:hover:text-gray-50 focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          GitHub
        </a>
        <span>{t('last_updated')}</span>
      </div>
    </footer>
  )
}
