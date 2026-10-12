import { test, expect } from '@playwright/test'

// Icon files must bypass the locale proxy; an intercepted path serves a page
// instead of an image.
test('every icon the site advertises loads as an image', async ({
  page,
  request,
}) => {
  await page.goto('/')
  const links = await page
    .locator('link[rel~="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll(els =>
      els.map(el => ({
        path: new URL(el.getAttribute('href')!, location.href).pathname,
        type: el.getAttribute('type'),
      })),
    )
  expect(links.map(l => l.type)).toContain('image/svg+xml')

  const manifest = await (await request.get('/site.webmanifest')).json()
  const paths = [
    '/favicon.ico',
    ...links.map(l => l.path),
    ...manifest.icons.map((icon: { src: string }) => icon.src),
  ]
  for (const path of paths) {
    const res = await request.get(path, { maxRedirects: 0 })
    expect(res.status(), path).toBe(200)
    expect(res.headers()['content-type'], path).toMatch(/^image\//)
  }
})
