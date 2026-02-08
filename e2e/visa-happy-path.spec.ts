import { test, expect } from '@playwright/test'

const visas = ['researcher', 'engineer', 'business-manager'] as const

for (const visa of visas) {
  test(`happy path: ${visa}`, async ({ page }) => {
    await page.goto(`/en/calculator/${visa}`)

    const start = page.getByRole('link', { name: 'Start Calculator' })
    await expect(start).toBeVisible()
    await start.click()

    await expect(page).toHaveURL(new RegExp(`/en/calculator/${visa}/`))

    // Complete the first prompt (education/degree is a CHOICE prompt for all visas).
    const radios = page.getByRole('radio')
    if ((await radios.count()) > 0) {
      await radios.first().click()
    } else {
      const input = page.locator('input[type="text"]').first()
      await expect(input).toBeVisible()
      await input.fill('3000000')
    }

    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page).toHaveURL(/\?q=/)

    // Fast, stable path to results.
    await page
      .getByRole('button', { name: /skip all & view result/i })
      .click()

    await expect(page).toHaveURL(new RegExp(`/en/calculator/${visa}/results`))
    await expect(
      page.getByRole('link', { name: /edit answers/i }),
    ).toBeVisible()
  })
}
