import { NumberPrompt as NumberPromptType, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from './VisaFormSection'
import { VisaType } from '@lib/domain'
import { Qualifications } from '@lib/domain/qualifications'
import { useState, useEffect, useRef } from 'react'
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
  prompt: NumberPromptType
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

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function formatWithCommas(value: number | undefined) {
    if (value === undefined) {
      return
    }

    if (isNaN(value)) {
      return 0
    }

    return Number(value).toLocaleString('en-US')
  }

  const promptKey = `${visaType}.sections.${section}.${prompt.id}`
  const t = useTranslations(`visa_form`)
  const showLabel = (prompt.config.hideLabel ?? false) === false
  const [validationError, setValidationError] = useState(
    undefined as string | undefined,
  )
  const hasError = validationError !== undefined

  function validate() {
    if (value === undefined) {
      setValidationError(t('validation.required'))
      return false
    }

    if (prompt.config.min !== undefined && prompt.config.min > value) {
      setValidationError(
        t('validation.min', { min: formatWithCommas(prompt.config.min) }),
      )
      return false
    }

    if (prompt.config.max !== undefined && prompt.config.max < value) {
      setValidationError(
        t('validation.max', { max: formatWithCommas(prompt.config.max) }),
      )
      return false
    }

    setValidationError(undefined)
    return true
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (!validate()) {
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
            ref={inputRef}
            type="text"
            className={classNames(
              'box-border h-full w-full pl-2 py-2 bg-transparent rounded shadow-border absolute left-0 right-0 top-0 bottom-0 overflow-hidden !outline-none focus-within:ring-2 focus-within:ring-emerald-400/80 appearance-none',
              {
                'pr-16': showLabel,
                'pr-2': !showLabel,
                '!ring-2 !ring-red-400/80': hasError,
              },
            )}
            min={prompt.config.min}
            max={prompt.config.max}
            pattern="[0-9,]*"
            inputMode="numeric"
            onChange={e => {
              const { value } = e.target
              const numberValue = Number(value.replace(/,/g, ''))
              setValue(numberValue)
              setValidationError(undefined)
            }}
            onKeyDown={e => {
              const okKey = [
                'Tab',
                'Backspace',
                'ArrowLeft',
                'ArrowRight',
              ].some(key => e.key === key)

              // This prevents NaN from proceeding with onChange
              if (!okKey && Number.isNaN(Number(e.key))) {
                e.preventDefault()
              }
            }}
            value={formatWithCommas(value)}
            name={prompt.id}
          />
          {showLabel ? (
            <span className="mx-1 absolute right-0 top-1 h-7 flex items-center font-bold text-xs bg-surface-accent/70 px-2 py-1 rounded-sm">
              {t(`${promptKey}.input_label`)}
            </span>
          ) : null}
        </div>
        {hasError ? (
          <span className="text-red-400 text-xs">{validationError}</span>
        ) : null}
      </div>

      <div className="flex flex-wrap -m-2">
        <button type="submit" className="button m-2">
          {t(`actions.continue`)}
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
        <button
          type="button"
          className="button secondary m-2"
          disabled={prompt.required}
          title={prompt.required ? t(`actions.cannot_skip_hint`) : undefined}
          onClick={() =>
            onSubmit(q => ({
              ...withCompletedPrompt(overallPromptIndex, q),
            }))
          }
        >
          {prompt.required ? t(`actions.cannot_skip`) : t(`actions.skip`)}
          <ChevronDoubleRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </form>
  )
}
