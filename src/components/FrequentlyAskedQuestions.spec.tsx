import { fireEvent, screen } from '@testing-library/react'

import { FrequentlyAskedQuestions } from '@components/FrequentlyAskedQuestions'
import { renderWithIntl } from '../test-utils/renderWithIntl'

describe('FrequentlyAskedQuestions', () => {
  // Use a translation prefix that exists in en.json with FAQs
  const translationPrefix = 'visa_form.engineer.sections.education.dual_degree'

  describe('returns null when count <= 0', () => {
    it('returns null when count is 0', () => {
      const { container } = renderWithIntl(
        <FrequentlyAskedQuestions
          count={0}
          translationPrefix={translationPrefix}
        />,
      )
      expect(container.firstChild).toBeNull()
    })
  })

  describe('renders correct number of FAQ items', () => {
    it('renders one FAQ item when count is 1', () => {
      renderWithIntl(
        <FrequentlyAskedQuestions
          count={1}
          translationPrefix={translationPrefix}
        />,
      )

      expect(
        screen.getByRole('heading', { name: /frequently asked questions/i }),
      ).toBeInTheDocument()

      const list = screen.getByRole('list')
      const items = screen.getAllByRole('listitem')
      expect(list).toBeInTheDocument()
      expect(items).toHaveLength(1)
    })

    it('renders two FAQ items when count is 2', () => {
      renderWithIntl(
        <FrequentlyAskedQuestions
          count={2}
          translationPrefix={translationPrefix}
        />,
      )

      const items = screen.getAllByRole('listitem')
      expect(items).toHaveLength(2)
    })
  })

  describe('click toggles expansion state', () => {
    it('expands answer when clicking on question', () => {
      renderWithIntl(
        <FrequentlyAskedQuestions
          count={1}
          translationPrefix={translationPrefix}
        />,
      )

      // Find the question heading (h3 element)
      const questionHeading = screen.getByRole('heading', { level: 3 })

      // Answer should be hidden initially
      const answerDiv =
        questionHeading.parentElement?.querySelector('.faq-answer')
      expect(answerDiv).toHaveClass('hidden')

      // Click to expand
      fireEvent.click(questionHeading)

      // Answer should now be visible (hidden class removed)
      expect(answerDiv).not.toHaveClass('hidden')
    })

    it('collapses answer when clicking on already expanded question', () => {
      renderWithIntl(
        <FrequentlyAskedQuestions
          count={1}
          translationPrefix={translationPrefix}
        />,
      )

      const questionHeading = screen.getByRole('heading', { level: 3 })
      const answerDiv =
        questionHeading.parentElement?.querySelector('.faq-answer')

      // Click to expand
      fireEvent.click(questionHeading)
      expect(answerDiv).not.toHaveClass('hidden')

      // Click again to collapse
      fireEvent.click(questionHeading)
      expect(answerDiv).toHaveClass('hidden')
    })
  })

  describe('multiple items can be opened/closed independently', () => {
    it('opening one item does not affect others', () => {
      renderWithIntl(
        <FrequentlyAskedQuestions
          count={2}
          translationPrefix={translationPrefix}
        />,
      )

      const questionHeadings = screen.getAllByRole('heading', { level: 3 })
      expect(questionHeadings).toHaveLength(2)

      const firstAnswer =
        questionHeadings[0].parentElement?.querySelector('.faq-answer')
      const secondAnswer =
        questionHeadings[1].parentElement?.querySelector('.faq-answer')

      // Both should start hidden
      expect(firstAnswer).toHaveClass('hidden')
      expect(secondAnswer).toHaveClass('hidden')

      // Open first item
      fireEvent.click(questionHeadings[0])
      expect(firstAnswer).not.toHaveClass('hidden')
      expect(secondAnswer).toHaveClass('hidden')

      // Open second item
      fireEvent.click(questionHeadings[1])
      expect(firstAnswer).not.toHaveClass('hidden')
      expect(secondAnswer).not.toHaveClass('hidden')
    })

    it('closing one item does not affect others', () => {
      renderWithIntl(
        <FrequentlyAskedQuestions
          count={2}
          translationPrefix={translationPrefix}
        />,
      )

      const questionHeadings = screen.getAllByRole('heading', { level: 3 })
      const firstAnswer =
        questionHeadings[0].parentElement?.querySelector('.faq-answer')
      const secondAnswer =
        questionHeadings[1].parentElement?.querySelector('.faq-answer')

      // Open both items
      fireEvent.click(questionHeadings[0])
      fireEvent.click(questionHeadings[1])
      expect(firstAnswer).not.toHaveClass('hidden')
      expect(secondAnswer).not.toHaveClass('hidden')

      // Close first item only
      fireEvent.click(questionHeadings[0])
      expect(firstAnswer).toHaveClass('hidden')
      expect(secondAnswer).not.toHaveClass('hidden')
    })

    it('uses bitwise XOR correctly for toggle state', () => {
      renderWithIntl(
        <FrequentlyAskedQuestions
          count={3}
          translationPrefix={'visa_form.engineer.sections.job.salary'}
        />,
      )

      const questionHeadings = screen.getAllByRole('heading', { level: 3 })
      expect(questionHeadings).toHaveLength(3)

      const answers = questionHeadings.map(h =>
        h.parentElement?.querySelector('.faq-answer'),
      )

      // Open item 0 (state: 001 = 1)
      fireEvent.click(questionHeadings[0])
      expect(answers[0]).not.toHaveClass('hidden')
      expect(answers[1]).toHaveClass('hidden')
      expect(answers[2]).toHaveClass('hidden')

      // Open item 2 (state: 101 = 5)
      fireEvent.click(questionHeadings[2])
      expect(answers[0]).not.toHaveClass('hidden')
      expect(answers[1]).toHaveClass('hidden')
      expect(answers[2]).not.toHaveClass('hidden')

      // Close item 0 (state: 100 = 4)
      fireEvent.click(questionHeadings[0])
      expect(answers[0]).toHaveClass('hidden')
      expect(answers[1]).toHaveClass('hidden')
      expect(answers[2]).not.toHaveClass('hidden')

      // Open item 1 (state: 110 = 6)
      fireEvent.click(questionHeadings[1])
      expect(answers[0]).toHaveClass('hidden')
      expect(answers[1]).not.toHaveClass('hidden')
      expect(answers[2]).not.toHaveClass('hidden')
    })
  })

  describe('displays real translations', () => {
    it('renders the FAQ heading from translations', () => {
      renderWithIntl(
        <FrequentlyAskedQuestions
          count={1}
          translationPrefix={translationPrefix}
        />,
      )

      expect(
        screen.getByRole('heading', { name: 'Frequently Asked Questions' }),
      ).toBeInTheDocument()
    })

    it('renders question text from translations', () => {
      renderWithIntl(
        <FrequentlyAskedQuestions
          count={1}
          translationPrefix={translationPrefix}
        />,
      )

      // The first question for dual_degree is about multiple majors
      expect(
        screen.getByText(/do multiple majors count as different degrees/i),
      ).toBeInTheDocument()
    })
  })
})
