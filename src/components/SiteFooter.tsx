'use client'

import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { usePathname } from 'next/navigation'

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
      <div className="flex justify-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <Link
          href="/privacy"
          className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          {t('privacy')}
        </Link>
        <a
          href="https://github.com/antonve/hsfp.tokyo"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          GitHub
        </a>
        <span>{t('last_updated')}</span>
      </div>
    </footer>
  )
}
