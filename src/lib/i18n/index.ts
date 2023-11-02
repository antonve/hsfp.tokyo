import acceptLanguage from 'accept-language'

export const DEFAULT_LOCALE: string = 'en'
export const SUPPORTED_LOCALES: string[] = [DEFAULT_LOCALE, 'vi']
export const I18N_COOKIE_NAME: string = 'i18next'

acceptLanguage.languages(SUPPORTED_LOCALES)

export function useTranslation(
  language: string,
  namespace: string,
  keyPrefix?: string,
) {
  return {
    t: () => '',
  }
}
