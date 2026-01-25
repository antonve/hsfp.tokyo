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
    <footer className="max-w-7xl mx-auto py-8 px-4 border-t-4 border-surface-secondary/50">
      <div className="flex justify-center gap-4 text-sm text-content-muted">
        <Link
          href="/privacy"
          className="hover:text-content-secondary transition-colors"
        >
          {t('privacy')}
        </Link>
        <span>{t('last_updated')}</span>
      </div>
    </footer>
  )
}
