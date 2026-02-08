import { fireEvent, screen, within } from '@testing-library/react'

import { VisaFormNavigation } from '@components/VisaFormNavigation'
import { VisaType } from '@lib/domain'
import { VisaProgress } from '@lib/domain/form'
import { QualificationsSchema } from '@lib/domain/qualifications'
import { formConfig as engineerForm } from '@lib/domain/visa.engineer'
import { renderWithIntl } from '../test-utils/renderWithIntl'

describe('VisaFormNavigation', () => {
  const baseQualifications = QualificationsSchema.parse({
    v: VisaType.Engineer,
    completed: 0,
    s: 'test-session',
  })

  const defaultProgress: VisaProgress = {
    section: 'education',
    promptIndex: 0,
  }

  describe('renders all sections', () => {
    it('displays all section titles from the form config', () => {
      renderWithIntl(
        <VisaFormNavigation
          config={engineerForm}
          progress={defaultProgress}
          qualifications={baseQualifications}
        />,
      )

      // Verify all sections from engineerForm.order are rendered
      // Order: ['education', 'job', 'research', 'university', 'employer', 'bonus']
      expect(screen.getByText('Education')).toBeInTheDocument()
      expect(screen.getByText('Job')).toBeInTheDocument()
      expect(screen.getByText('Research')).toBeInTheDocument()
      expect(screen.getByText('Bonus: education')).toBeInTheDocument()
      expect(screen.getByText('Bonus: employer')).toBeInTheDocument()
      expect(screen.getByText('Bonus: others')).toBeInTheDocument()
    })

    it('renders the navigation as a list', () => {
      renderWithIntl(
        <VisaFormNavigation
          config={engineerForm}
          progress={defaultProgress}
          qualifications={baseQualifications}
        />,
      )

      // The navigation contains multiple lists (main nav + nested prompt lists)
      const lists = screen.getAllByRole('list')
      expect(lists.length).toBeGreaterThan(0)
    })
  })

  describe('expandable sections toggle', () => {
    it('expands the active section by default', () => {
      renderWithIntl(
        <VisaFormNavigation
          config={engineerForm}
          progress={{ section: 'education', promptIndex: 0 }}
          qualifications={baseQualifications}
        />,
      )

      // The active section (education) should show its prompts
      expect(screen.getByText('Degree')).toBeInTheDocument()
      expect(screen.getByText('Multiple degrees')).toBeInTheDocument()
    })

    it('collapses inactive sections by default', () => {
      renderWithIntl(
        <VisaFormNavigation
          config={engineerForm}
          progress={{ section: 'education', promptIndex: 0 }}
          qualifications={baseQualifications}
        />,
      )

      // Job section prompts should not be visible initially
      expect(screen.queryByText('Salary')).not.toBeInTheDocument()
    })

    it('toggles section expansion when clicking on section header', () => {
      renderWithIntl(
        <VisaFormNavigation
          config={engineerForm}
          progress={{ section: 'education', promptIndex: 0 }}
          qualifications={baseQualifications}
        />,
      )

      // Initially job prompts are hidden
      expect(screen.queryByText('Salary')).not.toBeInTheDocument()

      // Click on Job section to expand
      const jobSection = screen.getByText('Job')
      fireEvent.click(jobSection)

      // Now job prompts should be visible
      expect(screen.getByText('Salary')).toBeInTheDocument()
      expect(screen.getByText('Professional experience')).toBeInTheDocument()
      expect(screen.getByText('Age')).toBeInTheDocument()
    })

    it('collapses expanded section when clicking again', () => {
      renderWithIntl(
        <VisaFormNavigation
          config={engineerForm}
          progress={{ section: 'education', promptIndex: 0 }}
          qualifications={baseQualifications}
        />,
      )

      // Click to expand Job section
      const jobSection = screen.getByText('Job')
      fireEvent.click(jobSection)
      expect(screen.getByText('Salary')).toBeInTheDocument()

      // Click again to collapse
      fireEvent.click(jobSection)
      expect(screen.queryByText('Salary')).not.toBeInTheDocument()
    })
  })

  describe('completion indicators', () => {
    it('shows check icon for completed prompts', () => {
      // Complete first 2 prompts (education section: degree and dual_degree)
      // completed bitmask: 0b11 = 3 (prompts 0 and 1 completed)
      const completedQualifications = QualificationsSchema.parse({
        v: VisaType.Engineer,
        completed: 3,
        s: 'test-session',
        degree: 'master',
        dual_degree: true,
      })

      renderWithIntl(
        <VisaFormNavigation
          config={engineerForm}
          progress={{ section: 'education', promptIndex: 0 }}
          qualifications={completedQualifications}
        />,
      )

      // Find all links in the education section prompts list
      // The prompt links have an svg (CheckIcon) when completed
      const allLinks = screen.getAllByRole('link')

      // Find the Degree and Multiple degrees links that contain the check icon SVG
      const degreeLink = allLinks.find(
        link =>
          link.textContent?.includes('Degree') &&
          !link.textContent?.includes('Multiple'),
      )
      const multipleDegreesLink = allLinks.find(link =>
        link.textContent?.includes('Multiple degrees'),
      )

      expect(degreeLink).toBeTruthy()
      expect(multipleDegreesLink).toBeTruthy()

      // Check icons (SVGs with text-emerald-600 class) should be present
      expect(degreeLink!.querySelector('svg')).toBeInTheDocument()
      expect(multipleDegreesLink!.querySelector('svg')).toBeInTheDocument()
    })

    it('does not show check icon for incomplete prompts', () => {
      renderWithIntl(
        <VisaFormNavigation
          config={engineerForm}
          progress={{ section: 'education', promptIndex: 0 }}
          qualifications={baseQualifications}
        />,
      )

      // Find prompt links in the education section
      const degreeLink = screen.getByRole('link', { name: /^Degree$/i })
      const multipleDegreesLink = screen.getByRole('link', {
        name: /^Multiple degrees$/i,
      })

      // No check icons should be present
      expect(degreeLink.querySelector('svg')).not.toBeInTheDocument()
      expect(multipleDegreesLink.querySelector('svg')).not.toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('renders prompt links that navigate to the correct URL', () => {
      renderWithIntl(
        <VisaFormNavigation
          config={engineerForm}
          progress={{ section: 'education', promptIndex: 0 }}
          qualifications={baseQualifications}
        />,
      )

      const degreeLink = screen.getByRole('link', { name: /^Degree$/i })
      expect(degreeLink).toHaveAttribute(
        'href',
        expect.stringContaining('/calculator/engineer/education/1'),
      )

      const multipleDegreesLink = screen.getByRole('link', {
        name: /^Multiple degrees$/i,
      })
      expect(multipleDegreesLink).toHaveAttribute(
        'href',
        expect.stringContaining('/calculator/engineer/education/2'),
      )
    })

    it('highlights the currently active prompt', () => {
      renderWithIntl(
        <VisaFormNavigation
          config={engineerForm}
          progress={{ section: 'education', promptIndex: 1 }}
          qualifications={baseQualifications}
        />,
      )

      // The dual_degree prompt (index 1) should be marked as active
      // Active prompts have border-zinc-900 class
      const multipleDegreesLink = screen.getByRole('link', {
        name: /^Multiple degrees$/i,
      })
      const listItem = multipleDegreesLink.closest('li')

      expect(listItem).toHaveClass('border-zinc-900')
    })

    it('disables links for prompts not yet reached', () => {
      renderWithIntl(
        <VisaFormNavigation
          config={engineerForm}
          progress={{ section: 'education', promptIndex: 0 }}
          qualifications={baseQualifications}
        />,
      )

      // Expand the Job section to see job prompts
      fireEvent.click(screen.getByText('Job'))

      // Job prompts should be disabled since education hasn't been completed
      const salaryLink = screen.getByRole('link', { name: /Salary/i })
      expect(salaryLink).toHaveClass('pointer-events-none')
    })

    it('enables links for completed prompts', () => {
      // Complete first prompt
      const partiallyCompleted = QualificationsSchema.parse({
        v: VisaType.Engineer,
        completed: 1, // First prompt completed
        s: 'test-session',
        degree: 'master',
      })

      renderWithIntl(
        <VisaFormNavigation
          config={engineerForm}
          progress={{ section: 'education', promptIndex: 1 }}
          qualifications={partiallyCompleted}
        />,
      )

      // First prompt (Degree) should be navigable
      const degreeLink = screen.getByRole('link', { name: /^Degree$/i })
      expect(degreeLink).not.toHaveClass('pointer-events-none')
    })
  })
})
