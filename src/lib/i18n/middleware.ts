import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { DEFAULT_LOCALE, I18N_COOKIE_NAME, SUPPORTED_LOCALES } from '@lib/i18n'
import { Middleware } from '@lib/middleware'

export function withI18n(middleware: Middleware) {
  return async (req: NextRequest, event?: NextFetchEvent) => {
    const response = await middleware(req, event)

    const locale =
      getLocaleFromCookies(req.cookies) ??
      getLocaleFromHeaders(req.headers) ??
      getLocaleFromReferer(req.headers) ??
      DEFAULT_LOCALE

    if (!req.cookies.has(I18N_COOKIE_NAME)) {
      response?.cookies.set(I18N_COOKIE_NAME, locale)
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
  if (cookies.has(I18N_COOKIE_NAME)) {
    return acceptLanguage.get(cookies.get(I18N_COOKIE_NAME)?.value)
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
    const localeInReferer = SUPPORTED_LOCALES.find(
      locale =>
        refererUrl.pathname.startsWith(`/${locale}/`) ||
        refererUrl.pathname === `/${locale}`,
    )

    return acceptLanguage.get(localeInReferer)
  }
}

function isLocaleRedirectRequired(nextURL: NextRequest['nextUrl']) {
  const pathStartsWithLocale = SUPPORTED_LOCALES.some(language =>
    nextURL.pathname.startsWith(`/${language}`),
  )
  const isNextAssetPrefix = nextURL.pathname.startsWith('/_next')
  const requiresRedirect = !pathStartsWithLocale && !isNextAssetPrefix

  return requiresRedirect
}
