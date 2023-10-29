import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLanguage, i18nCookieName, supportedLanguages } from '@lib/i18n'
import { Middleware } from '@lib/middleware'

export function withI18n(middleware: Middleware) {
  return async (req: NextRequest, event?: NextFetchEvent) => {
    const response = await middleware(req, event)

    const language =
      getLanguageFromCookies(req.cookies) ??
      getLanguageFromHeaders(req.headers) ??
      getLanguageFromReferer(req.headers) ??
      fallbackLanguage

    if (!req.cookies.has(i18nCookieName)) {
      response?.cookies.set(i18nCookieName, language)
    }

    if (isLanguageRedirectRequired(req.nextUrl)) {
      const target = req.nextUrl.clone()
      target.pathname = `/${language}${target.pathname}`
      return NextResponse.redirect(target)
    }

    return response
  }
}

function getLanguageFromCookies(cookies: NextRequest['cookies']) {
  if (cookies.has(i18nCookieName)) {
    return acceptLanguage.get(cookies.get(i18nCookieName)?.value)
  }
}

function getLanguageFromHeaders(headers: Headers) {
  const language = headers.get('Accept-Language')

  if (language) {
    return acceptLanguage.get(language)
  }
}

function getLanguageFromReferer(headers: Headers) {
  const referer = headers.get('Referer')

  if (referer) {
    const refererUrl = new URL(referer)
    const languageInReferer = supportedLanguages.find(
      language =>
        refererUrl.pathname.startsWith(`/${language}/`) ||
        refererUrl.pathname === `/${language}`,
    )

    return acceptLanguage.get(languageInReferer)
  }
}

function isLanguageRedirectRequired(nextURL: NextRequest['nextUrl']) {
  const pathStartsWithLanguage = supportedLanguages.some(language =>
    nextURL.pathname.startsWith(`/${language}`),
  )
  const isNextAssetPrefix = nextURL.pathname.startsWith('/_next')
  const requiresRedirect = !pathStartsWithLanguage && !isNextAssetPrefix

  return requiresRedirect
}
