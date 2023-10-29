import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLanguage, languages, cookieName } from './app/i18n/settings'

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:language*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
}

export function middleware(req: NextRequest) {
  const language =
    getLanguageFromCookies(req.cookies) ??
    getLanguageFromHeaders(req.headers) ??
    fallbackLanguage

  if (checkRedirectFromQueryParams(req.nextUrl, language)) {
    return NextResponse.redirect(
      new URL(`/${language}${req.nextUrl.pathname}`, req.url),
    )
  }
  getLanguageFromReferer(req.headers)
  return NextResponse.next()
}

function getLanguageFromCookies(cookies: NextRequest['cookies']) {
  // check i18next cookie
  if (cookies.has(cookieName)) {
    return acceptLanguage.get(cookies.get(cookieName)?.value)
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
    const languageInReferer = languages.find(language =>
      refererUrl.pathname.startsWith(`/${language}`),
    )
    const response = NextResponse.next()
    if (languageInReferer) response.cookies.set(cookieName, languageInReferer)
    return response
  }
}
function checkRedirectFromQueryParams(
  nextURL: NextRequest['nextUrl'],
  language: string,
) {
  const checkLanguageInParam = languages.some(language =>
    nextURL.pathname.startsWith(`/${language}`),
  )
  const nextAssetPrefix = nextURL.pathname.startsWith('/_next')

  if (!checkLanguageInParam && !nextAssetPrefix) {
    languages.some(loc => {
      nextURL.pathname.startsWith(`/${loc}`)
    })
    return true
  }
  return undefined
}
