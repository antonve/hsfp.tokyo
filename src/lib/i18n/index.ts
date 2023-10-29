import acceptLanguage from 'accept-language'
import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'

export const fallbackLanguage: string = 'en'
export const supportedLanguages: string[] = [fallbackLanguage, 'vn']
export const i18nCookieName: string = 'i18next'

const defaultNamespace: string = 'page'

acceptLanguage.languages(supportedLanguages)

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
      supportedLngs: supportedLanguages,
      fallbackLng: fallbackLanguage,
      lng: language,
      fallbackNS: defaultNamespace,
      defaultNS: defaultNamespace,
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
