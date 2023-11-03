import { Qualifications } from '@lib/visa'

// We keep track of completed prompts with bits set on a number.
// This is to avoid blowing up the size of the encoded qualifications string.
// `overallPromptIndex` is calculated by summing up all the prompts before it.

export function withCompletedPrompt(
  overallPromptIndex: number,
  q: Qualifications,
) {
  const mask = 1 << overallPromptIndex
  const completed = q.completed | mask

  return { ...q, completed } as Qualifications
}

export function isPromptCompleted(
  overallPromptIndex: number,
  q: Qualifications,
) {
  const mask = 1 << overallPromptIndex
  const isCompleted = (q.completed & mask) !== 0

  return isCompleted
}
