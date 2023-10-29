import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLanguage, i18nCookieName, supportedLanguages } from '@app/i18n'

acceptLanguage.languages(supportedLanguages)

export const config = {
  // matcher: '/:language*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
}

export function middleware(req: NextRequest) {
  const response = NextResponse.next()

  const language =
    getLanguageFromCookies(req.cookies) ??
    getLanguageFromHeaders(req.headers) ??
    getLanguageFromReferer(req.headers) ??
    fallbackLanguage

  if (!req.cookies.has(i18nCookieName)) {
    response.cookies.set(i18nCookieName, language)
  }

  if (isLanguageRedirectRequired(req.nextUrl)) {
    return NextResponse.redirect(
      new URL(`/${language}${req.nextUrl.pathname}`, req.url),
    )
  }

  return response
}

function getLanguageFromCookies(cookies: NextRequest['cookies']) {
  if (cookies.has(i18nCookieName)) {
    return acceptLanguage.get(cookies.get(i18nCookieName)?.value)
  }

  return undefined
}

function getLanguageFromHeaders(headers: Headers) {
  const language = headers.get('Accept-Language')
  return acceptLanguage.get(language)
}

function getLanguageFromReferer(headers: Headers) {
  const referer = headers.get('referer')

  if (referer) {
    const refererUrl = new URL(referer)
    const languageInReferer = supportedLanguages.find(language =>
      refererUrl.pathname.startsWith(`/${language}`),
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
