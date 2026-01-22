import { NextRequest, NextResponse } from 'next/server'
import { composeMiddleware } from 'next-compose-middleware'
import { intlMiddleware } from '@lib/i18n/middleware'

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|assets|favicon.ico|sw.js|.*opengraph-image.*).*)',
  ],
}

export function middleware(request: NextRequest) {
  return composeMiddleware(request, NextResponse.next(), {
    scripts: [intlMiddleware],
  })
}
