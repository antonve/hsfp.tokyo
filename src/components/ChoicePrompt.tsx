import {
  ChoicePrompt as ChoicePromptType,
  Prompt,
  SectionName,
} from '@lib/domain/form'
import {
  ArrowRightIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/20/solid'
import { useState } from 'react'
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
}: {
  qualifications: Qualifications
  visaType: VisaType
  section: SectionName
  prompt: ChoicePromptType
  overallPromptIndex: number
  onSubmit: (updateQualifications: QualificationUpdater) => void
  qualificationUpdater?: (value: string) => QualificationUpdater
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

  const promptKey = `${visaType}.sections.${section}.${prompt.id}`
  const t = useTranslations(`visa_form`)

  return (
    <form
      onSubmit={e => {
        e.preventDefault()

        if (!value) {
          // TODO: handle validation
          return
        }

        onSubmit(qualificationUpdater(value))
      }}
    >
      <div className="space-y-3 mb-8">
        {prompt.options.map((option, i) => (
          <div className="w-full" key={option}>
            <div
              className={cn(
                'px-2 py-2  min-h-9 rounded relative inline-block',
                {
                  'ring-2 ring-emerald-400/80': value === option,
                  'shadow-border': value !== option,
                },
              )}
            >
              <div className="flex">
                <input
                  id={promptOptionId(prompt, option)}
                  type="radio"
                  onChange={() => setValue(option)}
                  name={prompt.id}
                  className="absolute inset-0 cursor-pointer w-full h-full opacity-0"
                  checked={value === option}
                />
                <span
                  className={cn(
                    'flex shrink-0 w-5 h-5 items-center justify-center rounded text-xs font-bold',
                    {
                      'bg-emerald-500': value === option,
                      'bg-zinc-700/70': value !== option,
                    },
                  )}
                >
                  {getLetterForPosition(i)}
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
        <button type="submit" className="button m-2">
          {t(`actions.continue`)}
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
        <button
          type="button"
          className="button outline m-2"
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

function getLetterForPosition(i: number) {
  return String.fromCharCode(65 + i)
}
