import { test, expect } from '@playwright/test'

const visas = ['researcher', 'engineer', 'business-manager'] as const

type RadioSelector = 'first' | 'last'

async function walkToResults(
  page: import('@playwright/test').Page,
  locale: string,
  visa: string,
  radioSelector: RadioSelector = 'first',
) {
  // Walk prompts until we've submitted salary (required for non-error results),
  // then jump to results using the page-level shortcut.
  // Salary appears within the first 5 prompts for all visa types; 10 provides margin.
  let submittedSalary = false
  for (let i = 0; i < 10; i++) {
    const radios = page.getByRole('radio')
    const textInput = page.locator('input[type="text"]').first()

    const hasRadio = (await radios.count()) > 0
    const hasTextInput = (await textInput.count()) > 0

    expect(
      hasRadio || hasTextInput,
      `Expected radio buttons or text input on step ${i + 1}`,
    ).toBeTruthy()

    let willSubmitSalary = false

    if (hasRadio) {
      const radio = radioSelector === 'first' ? radios.first() : radios.last()
      await radio.click()
    } else {
      await expect(textInput).toBeVisible()
      const name = await textInput.getAttribute('name')

      const value = name === 'salary' ? '3000000' : name === 'age' ? '30' : '0'

      willSubmitSalary = name === 'salary'
      await textInput.fill(value)
    }

    const beforeContinueUrl = page.url()
    await page.getByRole('button', { name: /continue|続ける/i }).click()
    await expect(page).not.toHaveURL(beforeContinueUrl)

    if (willSubmitSalary) {
      submittedSalary = true

      await page
        .getByRole('button', { name: /skip all|すべてスキップ/i })
        .click()

      break
    }
  }

  expect(
    submittedSalary,
    'Salary prompt was never encountered in first 10 steps',
  ).toBeTruthy()

  // 'as-needed' locale prefix: en has no prefix, others keep it
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  await expect(page).toHaveURL(
    new RegExp(`${localePrefix}/calculator/${visa}/results`),
  )
}

for (const visa of visas) {
  test(`happy path: ${visa}`, async ({ page }) => {
    await page.goto(`/en/calculator/${visa}`)

    const start = page.getByRole('link', { name: 'Start Calculator' })
    await expect(start).toBeVisible()

    const beforeStartUrl = page.url()
    await start.click()
    await expect(page).not.toHaveURL(beforeStartUrl)

    await walkToResults(page, 'en', visa)

    // Salary should be present, so we should not see the missing-salary banner.
    await expect(
      page.getByText(/minimum annual salary of .*3,000,000/i),
    ).toHaveCount(0)

    await expect(
      page.getByRole('link', { name: /edit answers/i }),
    ).toBeVisible()
  })
}

// Test Japanese locale with one visa type
test('happy path: engineer (ja)', async ({ page }) => {
  await page.goto('/ja/calculator/engineer')

  const start = page.getByRole('link', { name: '計算を開始' })
  await expect(start).toBeVisible()

  const beforeStartUrl = page.url()
  await start.click()
  await expect(page).not.toHaveURL(beforeStartUrl)

  await walkToResults(page, 'ja', 'engineer')

  await expect(page.getByRole('link', { name: /回答を編集/i })).toBeVisible()
})

// Test selecting last radio option to exercise different code paths
test('happy path: engineer (last radio)', async ({ page }) => {
  await page.goto('/en/calculator/engineer')

  const start = page.getByRole('link', { name: 'Start Calculator' })
  await expect(start).toBeVisible()

  const beforeStartUrl = page.url()
  await start.click()
  await expect(page).not.toHaveURL(beforeStartUrl)

  await walkToResults(page, 'en', 'engineer', 'last')

  await expect(page.getByRole('link', { name: /edit answers/i })).toBeVisible()
})
