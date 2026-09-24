import { test, expect } from '@playwright/test'

const savedAnswer =
  'eyJkZWdyZWUiOiJkb2N0b3IiLCJkdWFsX2RlZ3JlZSI6dHJ1ZSwic2FsYXJ5IjowLCJ2IjoiZW5naW5lZXIiLCJjb21wbGV0ZWQiOjMsInMiOiIxNTRkZTg5ZS0xMzY4LTQ5ZDQtODJlYy1jNjNkYTk2YmU1YzciLCJfdiI6MX0='

test('advances questions in the browser and restores answers with Back', async ({
  page,
}, testInfo) => {
  await page.goto(`/calculator/engineer/education/2?q=${savedAnswer}`)
  await expect(
    page.getByRole('heading', {
      name: /hold multiple master's or doctorate degrees/i,
    }),
  ).toBeVisible()

  const serverRequests: string[] = []
  await page.route('**/calculator/engineer/job/1**', route => {
    serverRequests.push(route.request().url())
    return route.abort()
  })

  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page).toHaveURL(/\/calculator\/engineer\/job\/1\?q=/)
  await expect(
    page.getByRole('heading', {
      name: 'How many years of relevant professional experience do you have?',
    }),
  ).toBeVisible()
  expect(serverRequests).toEqual([])
  await page.unroute('**/calculator/engineer/job/1**')

  await page.getByRole('button', { name: /skip all.*view result/i }).click()
  await expect(page).toHaveURL(/\/calculator\/engineer\/results\?q=/)
  await page.goBack()
  await expect(page).toHaveURL(/\/calculator\/engineer\/job\/1\?q=/)
  await expect(page.locator('input[type="text"]')).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(/\/calculator\/engineer\/education\/2\?q=/)
  await expect(page.getByRole('radio', { name: /yes/i })).toBeChecked()

  await page.goForward()
  await expect(page).toHaveURL(/\/calculator\/engineer\/job\/1\?q=/)
  await expect(page.locator('input[type="text"]')).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('heading', {
      name: 'How many years of relevant professional experience do you have?',
    }),
  ).toBeVisible()

  await testInfo.attach('question-navigation.json', {
    body: JSON.stringify({
      initial: 'education/2',
      next: 'job/1',
      serverRequests,
      backRestoredAnswer: true,
      forwardAndReloadWorked: true,
      returnedFromResults: true,
    }),
    contentType: 'application/json',
  })
})
