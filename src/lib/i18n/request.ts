import { locale as rootLocale } from 'next/root-params'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@lib/i18n'

// `locale` is only set when a caller passes one explicitly, e.g.
// `getTranslations({ locale })`. Everything else (such as `useTranslations`
// in a Server Component) must read the `[locale]` segment of the request.
// Kept out of `@lib/i18n` because client components import that module and
// `next/root-params` is server-only.
export default getRequestConfig(async ({ locale }) => {
  const requested = locale ?? (await rootLocale())
  const resolvedLocale = hasLocale(SUPPORTED_LOCALES, requested)
    ? requested
    : DEFAULT_LOCALE
  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  }
})
