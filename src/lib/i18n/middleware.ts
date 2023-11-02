import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLanguage, i18nCookieName, supportedLanguages } from '@lib/i18n'
import { Middleware } from '@lib/middleware'

export function withI18n(middleware: Middleware) {
  return async (req: NextRequest, event?: NextFetchEvent) => {
    const response = await middleware(req, event)

    const locale =
      getLocaleFromCookies(req.cookies) ??
      getLocaleFromHeaders(req.headers) ??
      getLocaleFromReferer(req.headers) ??
      fallbackLanguage

    if (!req.cookies.has(i18nCookieName)) {
      response?.cookies.set(i18nCookieName, locale)
    }

    if (isLocaleRedirectRequired(req.nextUrl)) {
      const target = req.nextUrl.clone()
      target.pathname = `/${locale}${target.pathname}`
      return NextResponse.redirect(target)
    }

    return response
  }
}

function getLocaleFromCookies(cookies: NextRequest['cookies']) {
  if (cookies.has(i18nCookieName)) {
    return acceptLanguage.get(cookies.get(i18nCookieName)?.value)
  }
}

function getLocaleFromHeaders(headers: Headers) {
  const language = headers.get('Accept-Language')

  if (language) {
    return acceptLanguage.get(language)
  }
}

function getLocaleFromReferer(headers: Headers) {
  const referer = headers.get('Referer')

  if (referer) {
    const refererUrl = new URL(referer)
    const localeInReferer = supportedLanguages.find(
      locale =>
        refererUrl.pathname.startsWith(`/${locale}/`) ||
        refererUrl.pathname === `/${locale}`,
    )

    return acceptLanguage.get(localeInReferer)
  }
}

function isLocaleRedirectRequired(nextURL: NextRequest['nextUrl']) {
  const pathStartsWithLocale = supportedLanguages.some(language =>
    nextURL.pathname.startsWith(`/${language}`),
  )
  const isNextAssetPrefix = nextURL.pathname.startsWith('/_next')
  const requiresRedirect = !pathStartsWithLocale && !isNextAssetPrefix

  return requiresRedirect
}
