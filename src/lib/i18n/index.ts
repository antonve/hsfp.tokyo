import { getRequestConfig } from 'next-intl/server'

export const DEFAULT_LOCALE = 'en' as const
export const SUPPORTED_LOCALES = [
  DEFAULT_LOCALE,
  'ja',
  'zh-TW',
  'zh-CN',
] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = (locale ?? DEFAULT_LOCALE) as string
  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  }
})
