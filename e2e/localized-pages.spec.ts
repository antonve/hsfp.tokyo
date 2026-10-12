import { test, expect } from '@playwright/test'
import en from '../src/lib/i18n/messages/en.json' with { type: 'json' }
import ja from '../src/lib/i18n/messages/ja.json' with { type: 'json' }
import zhCN from '../src/lib/i18n/messages/zh-CN.json' with { type: 'json' }
import zhTW from '../src/lib/i18n/messages/zh-TW.json' with { type: 'json' }

// Server-rendered pages that translate without being passed the locale.
const locales = { en, ja, 'zh-CN': zhCN, 'zh-TW': zhTW }

for (const [locale, messages] of Object.entries(locales)) {
  const prefix = locale === 'en' ? '' : `/${locale}`
  const pages = [
    ['', messages.home.title],
    ['/about', messages.about.title],
    ['/privacy', messages.privacy.title],
  ]

  for (const [path, title] of pages) {
    const url = `${prefix}${path}` || '/'
    test(`${url} renders its page heading in ${locale}`, async ({ page }) => {
      await page.goto(url)
      // The site logo in the header is also an <h1>.
      await expect(page.locator('h1:not(header h1)')).toHaveAccessibleName(
        title,
      )
    })
  }
}
