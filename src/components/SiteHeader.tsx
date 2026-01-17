'use client'

import { Logo } from '@components/Logo'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { usePathname } from 'next/navigation'

export function SiteHeader() {
  const pathname = usePathname()
  const t = useTranslations('nav')

  // Hide header only on calculator form pages, not on results page
  const shouldHideHeader = pathname.includes('/calculator/') && !pathname.endsWith('/results')

  if (shouldHideHeader) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto">
      <header className="py-6 px-4 flex justify-between space-x-8 border-b-4 border-zinc-900/50">
        <Logo />
        <nav>
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
        </nav>
      </header>
    </div>
  )
}
