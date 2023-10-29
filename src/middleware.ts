import { withI18n } from '@lib/i18n/middleware'
import { chain } from '@lib/middleware'

export const config = {
  // matcher: '/:language*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
}

export default chain([withI18n])
