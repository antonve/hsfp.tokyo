import { test, expect } from '@playwright/test'

const images = [
  ['home', '/opengraph-image'],
  ['visa', '/calculator/engineer/opengraph-image'],
  [
    'progress',
    '/calculator/engineer/education/1/opengraph-image?progress=50&points=40',
  ],
  ['results', '/calculator/engineer/results/opengraph-image?points=80'],
] as const

for (const locale of ['en', 'ja']) {
  for (const [name, path] of images) {
    test(`${locale} ${name} share image renders as a PNG`, async ({
      request,
    }, testInfo) => {
      const response = await request.get(`/${locale}${path}`)
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('image/png')

      const body = await response.body()
      expect(body.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
      expect([body.readUInt32BE(16), body.readUInt32BE(20)]).toEqual([
        1200, 630,
      ])
      await testInfo.attach(`${locale}-${name}.png`, {
        body,
        contentType: 'image/png',
      })
    })
  }
}
