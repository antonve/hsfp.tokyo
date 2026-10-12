export const DEFAULT_LOCALE = 'en' as const
export const SUPPORTED_LOCALES = [
  DEFAULT_LOCALE,
  'ja',
  'zh-TW',
  'zh-CN',
] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]
