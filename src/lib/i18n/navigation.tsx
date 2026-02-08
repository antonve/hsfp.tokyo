'use client'

import NextLink from 'next/link'
import { useLocale } from 'next-intl'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@lib/i18n'
import React from 'react'

type Href = Parameters<typeof NextLink>[0]['href']

function hasLocalePrefix(href: string) {
  return SUPPORTED_LOCALES.some(
    l => href === `/${l}` || href.startsWith(`/${l}/`),
  )
}

function localizeHref(href: string, locale: string) {
  // External links or non-path hrefs are passed through.
  if (!href.startsWith('/')) return href

  // Already localized.
  if (hasLocalePrefix(href)) return href

  // Default locale uses no prefix (localePrefix: 'as-needed').
  if (locale === DEFAULT_LOCALE) return href

  // Root needs special handling to avoid double slashes.
  if (href === '/') return `/${locale}`
  return `/${locale}${href}`
}

export const Link = React.forwardRef<
  HTMLAnchorElement,
  Omit<React.ComponentProps<typeof NextLink>, 'href' | 'locale'> & {
    href: Href
    locale?: string
  }
>(function LinkWithLocale({ href, locale: localeProp, ...props }, ref) {
  const currentLocale = useLocale()
  const targetLocale = localeProp ?? currentLocale

  if (typeof href === 'string') {
    const localized = localizeHref(href, targetLocale)

    // If the caller explicitly requests the default locale (e.g. language
    // switcher), keep the locale prefix so the link is unambiguous.
    const finalHref =
      localeProp && targetLocale === DEFAULT_LOCALE && localized === href
        ? `/${DEFAULT_LOCALE}${href === '/' ? '' : href}`
        : localized

    return <NextLink ref={ref} href={finalHref} {...props} />
  }

  // For UrlObject etc, we don't try to rewrite.
  return <NextLink ref={ref} href={href} {...props} />
})
