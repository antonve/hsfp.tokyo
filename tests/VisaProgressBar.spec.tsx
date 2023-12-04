import { test, expect } from '@playwright/experimental-ct-react'

import { VisaProgressBar } from '@components/VisaProgressBar'

import { qualificationsEducation, qualifications0Percent, config } from './data'

test.use({ viewport: { width: 500, height: 500 } })

test('Testing VisaProgressBar under different props progress', async ({
  mount,
}) => {
  const progressBarNoProgress = await mount(
    <VisaProgressBar config={config} qualifications={qualifications0Percent} />,
  )
  // progress bar should be at 0px
  await expect(progressBarNoProgress).toBeVisible
  const redBarNoProgress = progressBarNoProgress.getByTestId('progress-bar')
  await expect(redBarNoProgress).toHaveCSS('width', '0px')
  // progress bar should be at 22.5078px
  await progressBarNoProgress.unmount()
  const progressBarEducationSectionCompleted = await mount(
    <VisaProgressBar
      config={config}
      qualifications={qualificationsEducation}
    />,
  )
  await expect(progressBarEducationSectionCompleted).toBeVisible
  const redBarEducation =
    progressBarEducationSectionCompleted.getByTestId('progress-bar')
  await expect(redBarEducation).toHaveCSS('width', '22.5078px')
})
