import acceptLanguage from 'accept-language'
import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'

export const DEFAULT_LOCALE: string = 'en'
export const SUPPORTED_LOCALES: string[] = [DEFAULT_LOCALE, 'vi']
export const I18N_COOKIE_NAME: string = 'i18next'

const DEFAULT_NAMESPACE: string = 'page'

acceptLanguage.languages(SUPPORTED_LOCALES)

const initI18next = async (language: string, namespace: string) => {
  const i18nInstance = createInstance()

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`),
      ),
    )
    .init({
      // debug: true,
      supportedLngs: SUPPORTED_LOCALES,
      fallbackLng: DEFAULT_LOCALE,
      lng: language,
      fallbackNS: DEFAULT_NAMESPACE,
      defaultNS: DEFAULT_NAMESPACE,
      ns: namespace,
    })

  return i18nInstance
}

export async function useTranslation(
  language: string,
  namespace: string,
  keyPrefix?: string,
) {
  const i18nextInstance = await initI18next(language, namespace)

  return {
    t: i18nextInstance.getFixedT(
      language,
      Array.isArray(namespace) ? namespace[0] : namespace,
      keyPrefix,
    ),
    i18n: i18nextInstance,
  }
}
