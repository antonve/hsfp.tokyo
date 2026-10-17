import { test, expect } from '@playwright/test'
import en from '../src/lib/i18n/messages/en.json' with { type: 'json' }
import ja from '../src/lib/i18n/messages/ja.json' with { type: 'json' }

const locales = { en, ja }
const visas = ['engineer', 'researcher', 'business-manager']

for (const [locale, messages] of Object.entries(locales)) {
  const prefix = locale === 'en' ? '' : `/${locale}`

  for (const colorScheme of ['light', 'dark'] as const) {
    test.describe(`${locale} landing (${colorScheme})`, () => {
      test.use({ viewport: { width: 390, height: 844 }, colorScheme })

      test.beforeEach(async ({ page }) => {
        await page.goto(prefix || '/')
      })

      test('all three work options fit on the first screen', async ({
        page,
      }) => {
        for (const visa of visas) {
          await expect
            .soft(page.locator(`a[href="${prefix}/calculator/${visa}"]`))
            .toBeInViewport({ ratio: 1 })
        }
      })

      test('the engineer option opens its existing intro', async ({ page }) => {
        await page.locator(`a[href="${prefix}/calculator/engineer"]`).click()
        await expect(page).toHaveURL(`${prefix}/calculator/engineer`)
      })

      test('the ISA mentions open the official page in a new tab', async ({
        page,
        context,
      }) => {
        const url =
          'https://www.moj.go.jp/isa/applications/resources/newimmiact_3_index.html'
        // Keep the test off the real ISA site
        await context.route(url, route => route.fulfill({ body: 'ISA' }))
        const links = page.locator(`main a[href="${url}"]`)
        await expect(links).toHaveCount(2)
        const [popup] = await Promise.all([
          page.waitForEvent('popup'),
          links.first().click(),
        ])
        await expect(popup).toHaveURL(url)
        await expect(page).toHaveURL(new RegExp(`${prefix || '/'}$`))
      })

      test('has exactly one page heading in the selected language', async ({
        page,
      }) => {
        const heading = page.locator('h1:not(header h1)')
        await expect(heading).toHaveCount(1)
        await expect(heading).toHaveAccessibleName(messages.home.title)
      })

      test('header contains no Home or About navigation links', async ({
        page,
      }) => {
        // Count hidden desktop links too; the logo remains the way home.
        await expect
          .soft(
            page.locator(`header a[href="${prefix || '/'}"]`).filter({
              hasNot: page.locator('h1'),
            }),
          )
          .toHaveCount(0)
        await expect
          .soft(page.locator(`header a[href="${prefix}/about"]`))
          .toHaveCount(0)
      })

      test('footer opens Sources and contact in the selected language', async ({
        page,
      }) => {
        const link = page.locator(`footer a[href="${prefix}/about"]`)
        // The count fails directly on the old footer, without a click timeout.
        await expect(link).toHaveCount(1)
        await expect(link).toHaveAccessibleName(messages.about.title)
        await link.click()
        await expect(page).toHaveURL(`${prefix}/about`)
        await expect(page.locator('h1:not(header h1)')).toHaveAccessibleName(
          messages.about.title,
        )
      })
    })
  }
}
