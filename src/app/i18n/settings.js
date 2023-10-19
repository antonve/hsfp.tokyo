export const fallbackLanguage = 'en'
export const languages = [fallbackLanguage, 'vn']
export const defaultNS = 'page'
export const cookieName = 'i18next'

export function getOptions (lng = fallbackLanguage, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLanguage,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}