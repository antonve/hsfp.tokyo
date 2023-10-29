export const fallbackLanguage: string = 'en'
export const languages: string[] = [fallbackLanguage, 'vn']
export const defaultNS: string = 'page'
export const cookieName: string = 'i18next'

export function getOptions(lng = fallbackLanguage, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLanguage,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}
