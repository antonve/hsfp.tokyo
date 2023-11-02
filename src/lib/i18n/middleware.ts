import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@lib/i18n'
import { ComposableMiddleware } from 'next-compose-middleware'
import createMiddleware from 'next-intl/middleware'

const middleware = createMiddleware({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
})

export const intlMiddleware: ComposableMiddleware = async (req, res) =>
  middleware(req)
