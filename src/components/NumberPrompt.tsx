import { NumberPrompt, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from './VisaFormSection'
import { VisaType } from '@lib/domain'
import { Qualifications } from '@lib/domain/qualifications'
import { useState } from 'react'
import { isPromptCompleted, withCompletedPrompt } from '@lib/domain/prompts'
import {
  ArrowRightIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/20/solid'
import { useTranslations } from 'next-intl'
import classNames from 'classnames'

export function NumberPrompt({
  prompt,
  onSubmit,
  overallPromptIndex,
  qualifications,
  visaType,
  section,
}: {
  qualifications: Qualifications
  visaType: VisaType
  section: SectionName
  prompt: NumberPrompt
  overallPromptIndex: number
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  const [value, setValue] = useState<number | undefined>(() => {
    if (isPromptCompleted(overallPromptIndex, qualifications)) {
      const value = qualifications[prompt.id as keyof Qualifications]
      if (!value) {
        return undefined
      }

      const numeric = parseInt(value.toString())
      if (isNaN(numeric)) {
        return undefined
      }

      return numeric
    }

    return undefined
  })

  const promptKey = `${visaType}.sections.${section}.${prompt.id}`
  const t = useTranslations(`visa_form`)
  const showLabel = (prompt.config.hideLabel ?? false) === false

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (!value) {
          // TODO: handle validation
          return
        }

        onSubmit(q => ({
          ...withCompletedPrompt(overallPromptIndex, q),
          [prompt.id]: value,
        }))
      }}
    >
      <div className="space-y-3 mb-8">
        <div className="relative h-9 w-full md:max-w-[200px]">
          <input
            type="number"
            className={classNames(
              'pl-2 py-2 bg-transparent rounded shadow-border absolute left-0 right-0 top-0 bottom-0 overflow-hidden !outline-none focus-within:ring-2 focus-within:ring-emerald-400/80 appearance-none',
              {
                'pr-16': showLabel,
                'pr-2': !showLabel,
              },
            )}
            min={prompt.config.min}
            max={prompt.config.max}
            step={prompt.config.step}
            onChange={e => setValue(e.currentTarget.valueAsNumber)}
            value={value}
            name={prompt.id}
          />
          {showLabel ? (
            <span className="mx-1 absolute right-0 top-1 h-7 flex items-center font-bold text-xs bg-zinc-700/70 px-2 py-1 rounded-sm">
              {t(`${promptKey}.input_label`)}
            </span>
          ) : null}
        </div>
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
