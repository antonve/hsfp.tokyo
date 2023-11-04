import {
  FormConfig,
  SectionName,
  getOverallPromptIndex,
} from '@lib/domain/form'
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

export function didCompleteSection(
  q: Qualifications,
  config: FormConfig,
  name: SectionName,
) {
  const startPromptId = getOverallPromptIndex(config, name, 0)
  const prompts = config.sections[name]?.length ?? 0
  const promptIdsToCheck = [...Array(prompts)].map((_, i) => i + startPromptId)

  const didComplete = promptIdsToCheck
    .map(promptId => isPromptCompleted(promptId, q))
    .every(found => found === true)

  return didComplete
}

export function getHighestCompletedOverallPromptIndex(q: Qualifications) {
  const n = q.completed

  if (n === 0) {
    return -1
  }

  // Formula for most significant bit in a number
  // Ref: https://workat.tech/problem-solving/approach/msb/most-significant-bit
  return Math.floor(Math.log(n) / Math.log(2))
}
