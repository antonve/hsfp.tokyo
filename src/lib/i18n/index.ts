import { getRequestConfig } from 'next-intl/server'

export const DEFAULT_LOCALE: string = 'en'
export const SUPPORTED_LOCALES: string[] = [DEFAULT_LOCALE, 'vi']

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}))
