import { ChoicePrompt, Prompt, SectionName } from '@lib/domain/form'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import cn from 'classnames'
import { QualificationUpdater } from './VisaFormSection'
import { useTranslations } from 'next-intl'
import { VisaType } from '@lib/domain'

export function ChoicePrompt({
  visaType,
  section,
  prompt,
  onSubmit,
  qualificationUpdater = value => q => ({ ...q, [prompt.id]: value }),
}: {
  visaType: VisaType
  section: SectionName
  prompt: ChoicePrompt
  onSubmit: (updateQualifications: QualificationUpdater) => void
  qualificationUpdater?: (value: string) => QualificationUpdater
}) {
  const [value, setValue] = useState<string | undefined>(undefined)
  const t = useTranslations(
    `visa_form.${visaType}.sections.${section}.${prompt.id}`,
  )

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
      <div className="space-y-4 mb-8">
        {prompt.options.map((option, i) => (
          <div className="w-full" key={option}>
            <div
              className={cn('px-2 py-2  h-9 rounded relative inline-block', {
                'ring-2 ring-emerald-400/80': value === option,
                'shadow-border': value !== option,
              })}
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
                    'flex w-5 h-5 items-center justify-center rounded text-xs font-bold',
                    {
                      'bg-emerald-500': value === option,
                      'bg-stone-700/70': value !== option,
                    },
                  )}
                >
                  {getLetterForPosition(i)}
                </span>
                <label
                  htmlFor={promptOptionId(prompt, option)}
                  className="pl-3 h-5 text-lg flex items-center"
                >
                  {t(`options.${option}.label`)}
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button type="submit" className="button">
        Continue
        <ArrowRightIcon className="h-5 w-5 ml-2" />
      </button>
    </form>
  )
}

function promptOptionId(prompt: Prompt, option: string) {
  return `${prompt.id}-${option}`
}

function getLetterForPosition(i: number) {
  return String.fromCharCode(65 + i)
}
