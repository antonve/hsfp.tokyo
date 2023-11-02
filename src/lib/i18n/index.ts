import acceptLanguage from 'accept-language'
import { getRequestConfig } from 'next-intl/server'

export const DEFAULT_LOCALE: string = 'en'
export const SUPPORTED_LOCALES: string[] = [DEFAULT_LOCALE, 'vi']
export const I18N_COOKIE_NAME: string = 'i18next'

acceptLanguage.languages(SUPPORTED_LOCALES)

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}))

export function useTranslation(
  language: string,
  namespace: string,
  keyPrefix?: string,
) {
  return {
    t: () => '',
  }
}
