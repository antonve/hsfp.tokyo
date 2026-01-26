import {
  ChoicePrompt as ChoicePromptType,
  Prompt,
  SectionName,
} from '@lib/domain/form'
import {
  ArrowRightIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/20/solid'
import { useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import { QualificationUpdater } from './VisaFormSection'
import { useTranslations } from 'next-intl'
import { VisaType } from '@lib/domain'
import { isPromptCompleted, withCompletedPrompt } from '@lib/domain/prompts'
import { Qualifications } from '@lib/domain/qualifications'

export function ChoicePrompt({
  qualifications,
  visaType,
  section,
  prompt,
  overallPromptIndex,
  onSubmit,
  qualificationUpdater = value => q => ({
    ...withCompletedPrompt(overallPromptIndex, q),
    [prompt.id]: value,
  }),
  isLoading = false,
}: {
  qualifications: Qualifications
  visaType: VisaType
  section: SectionName
  prompt: ChoicePromptType
  overallPromptIndex: number
  onSubmit: (updateQualifications: QualificationUpdater) => void
  qualificationUpdater?: (value: string) => QualificationUpdater
  isLoading?: boolean
}) {
  const [value, setValue] = useState<string | undefined>(() => {
    if (isPromptCompleted(overallPromptIndex, qualifications)) {
      const result =
        qualifications[prompt.id as keyof Qualifications]?.toString()
      const fallback = prompt.options[prompt.options.length - 1]

      // We need a fallback here because `false` values are not persisted
      // in qualifications to reduce qualifications hash size.
      return result ?? fallback
    }

    return undefined
  })
  const [error, setError] = useState<string | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys 1-9
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1
        if (index < prompt.options.length) {
          setValue(prompt.options[index])
          setError(null)
          inputRefs.current[index]?.focus()
        }
      }
      // Arrow up/down
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const currentIndex = value ? prompt.options.indexOf(value) : -1
        const delta = e.key === 'ArrowDown' ? 1 : -1
        const newIndex =
          (currentIndex + delta + prompt.options.length) % prompt.options.length
        setValue(prompt.options[newIndex])
        setError(null)
        inputRefs.current[newIndex]?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [value, prompt.options])

  const promptKey = `${visaType}.sections.${section}.${prompt.id}`
  const t = useTranslations(`visa_form`)

  return (
    <form
      onSubmit={e => {
        e.preventDefault()

        if (!value) {
          setError(t('validation.choice_required'))
          return
        }

        onSubmit(qualificationUpdater(value))
      }}
    >
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <div className="space-y-3 mb-8">
        {prompt.options.map((option, i) => (
          <div
            className="w-full motion-preset-slide-up motion-duration-300"
            key={option}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div
              className={cn(
                'px-2 py-2 min-h-9 rounded relative inline-block bg-white dark:bg-zinc-950 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-emerald-400/80',
                {
                  'ring-2 ring-emerald-400/80 motion-preset-fade motion-duration-200':
                    value === option,
                  'shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800':
                    value !== option,
                },
              )}
            >
              <div className="flex">
                <input
                  ref={el => {
                    inputRefs.current[i] = el
                  }}
                  id={promptOptionId(prompt, option)}
                  type="radio"
                  onChange={() => {
                    setValue(option)
                    setError(null)
                  }}
                  name={prompt.id}
                  className="absolute inset-0 cursor-pointer w-full h-full opacity-0"
                  checked={value === option}
                />
                <span
                  className={cn(
                    'flex shrink-0 w-5 h-5 items-center justify-center rounded text-xs font-bold transition-colors',
                    {
                      'bg-emerald-500 motion-scale-in-100 motion-duration-150':
                        value === option,
                      'bg-zinc-200/70 dark:bg-zinc-600/70': value !== option,
                    },
                  )}
                >
                  {i + 1}
                </span>
                <label
                  htmlFor={promptOptionId(prompt, option)}
                  className="pl-3 -my-1 min-h-5 text-lg flex items-center"
                >
                  {t(`${promptKey}.options.${option}`)}
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap -m-2">
        <button type="submit" className="button m-2" disabled={isLoading}>
          <span className={isLoading ? 'invisible' : ''}>
            {t(`actions.continue`)}
          </span>
          <ArrowRightIcon
            className={`h-5 w-5 ml-2 ${isLoading ? 'invisible' : ''}`}
          />
          {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </span>
          )}
        </button>
        <button
          type="button"
          className="button secondary m-2"
          disabled={isLoading}
          onClick={() =>
            onSubmit(q => ({
              ...withCompletedPrompt(overallPromptIndex, q),
            }))
          }
        >
          {t(`actions.skip`)}
          <ChevronDoubleRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </form>
  )
}

function promptOptionId(prompt: Prompt, option: string) {
  return `${prompt.id}-${option}`
}
