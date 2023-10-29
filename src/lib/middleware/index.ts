import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

type MiddlewareResult = NextResponse | null | undefined | void
export type Middleware = (
  request: NextRequest,
  event: NextFetchEvent,
) => MiddlewareResult | Promise<MiddlewareResult>

type MiddlewareFactory = (middleware: Middleware) => Middleware

export function chain(functions: MiddlewareFactory[], index = 0): Middleware {
  const current = functions[index]

  if (current) {
    const next = chain(functions, index + 1)
    return current(next)
  }

  return () => NextResponse.next()
}
