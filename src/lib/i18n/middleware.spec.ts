import 'cross-fetch/polyfill'
import { NextRequest, NextResponse } from 'next/server'
import { withI18n } from './middleware'

describe('withI18n', () => {
  const redirectSpy = jest.spyOn(NextResponse, 'redirect')

  async function runMiddleware(req: NextRequest) {
    return await withI18n(() => NextResponse.next())(req)
  }

  afterEach(() => {
    redirectSpy.mockReset()
  })

  it('should do nothing if language is present', async () => {
    const req = new NextRequest('https://hsfp.tokyo/en')

    await runMiddleware(req)

    expect(redirectSpy).not.toHaveBeenCalled()
  })

  it('should redirect to english if no language is present', async () => {
    const req = new NextRequest('https://hsfp.tokyo/about')

    await runMiddleware(req)

    expect(redirectSpy).toHaveBeenCalledOnce()
    expect(redirectSpy.mock.calls[0][0].toString()).toBe(
      'https://hsfp.tokyo/en/about',
    )
  })

  it('should redirect to cookie language if no language is present', async () => {
    const req = new NextRequest('https://hsfp.tokyo/about', {
      headers: {
        Cookie: 'i18next=vi',
      },
    })

    await runMiddleware(req)

    expect(redirectSpy).toHaveBeenCalledOnce()
    expect(redirectSpy.mock.calls[0][0].toString()).toBe(
      'https://hsfp.tokyo/vi/about',
    )
  })

  it('should redirect to header language if no language is present', async () => {
    const req = new NextRequest('https://hsfp.tokyo/about', {
      headers: {
        'Accept-Language': 'vi-VN',
      },
    })

    await runMiddleware(req)

    expect(redirectSpy).toHaveBeenCalledOnce()
    expect(redirectSpy.mock.calls[0][0].toString()).toBe(
      'https://hsfp.tokyo/vi/about',
    )
  })

  it('should redirect to refer language if no language is present', async () => {
    const req = new NextRequest('https://hsfp.tokyo/about', {
      headers: {
        Referer: 'https://example.com/vi/test',
      },
    })

    await runMiddleware(req)

    expect(redirectSpy).toHaveBeenCalledOnce()
    expect(redirectSpy.mock.calls[0][0].toString()).toBe(
      'https://hsfp.tokyo/vi/about',
    )
  })

  it('should not redirect to refer language if path does not start with a language', async () => {
    const req = new NextRequest('https://hsfp.tokyo/about', {
      headers: {
        Referer: 'https://example.com/vitest',
      },
    })

    await runMiddleware(req)

    expect(redirectSpy).toHaveBeenCalledOnce()
    expect(redirectSpy.mock.calls[0][0].toString()).toBe(
      'https://hsfp.tokyo/en/about',
    )
  })
})
