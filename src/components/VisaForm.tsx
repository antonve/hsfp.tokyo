'use client'

import {
  BooleanPrompt,
  ChoicePrompt,
  FormConfig,
  NumberPrompt,
  Prompt,
  SectionName,
  VisaProgress,
  nextStepOfForm,
} from '@lib/domain/form'
import { Qualifications, encodeQualifications } from '@lib/visa'
import { useQualifications, useVisaFormProgress } from '@lib/hooks'
import { useParams, useRouter } from 'next/navigation'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import cn from 'classnames'

interface Props {
  config: FormConfig
}

export function VisaForm({ config }: Props) {
  const qualifications = useQualifications(config.visaType)
  const progress = useVisaFormProgress(config)

  return (
    <VisaFormSection
      config={config}
      progress={progress}
      qualifications={qualifications}
    />
  )
}

type QualificationUpdater = (qualifications: Qualifications) => Qualifications

function VisaFormSection({
  config,
  progress,
  qualifications,
}: {
  config: FormConfig
  progress: VisaProgress
  qualifications: Qualifications
}) {
  const router = useRouter()
  const params = useParams()

  const prompts = config.sections[progress.section]!!
  const prompt = prompts[progress.promptIndex]

  const submit = (updateQualifications: QualificationUpdater) => {
    const { section, promptIndex } = nextStepOfForm(config, progress)
    const newQualifications = updateQualifications(qualifications)

    router.push(
      `/calculator/${params['visa']}/${section}/${
        promptIndex + 1
      }?q=${encodeQualifications(newQualifications)}`,
    )
  }

  return (
    <div className="pb-10">
      <h2 className="font-bold text-xl mb-4">{progress.section}</h2>
      <VisaFormPrompt
        prompt={prompt}
        onSubmit={submit}
        section={progress.section}
      />
    </div>
  )
}

function VisaFormPrompt({
  prompt,
  section,
  onSubmit,
}: {
  prompt: Prompt
  section: SectionName
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  switch (prompt.type) {
    case 'NUMBER':
      return (
        <div>
          <NumberPrompt prompt={prompt} onSubmit={onSubmit} section={section} />
        </div>
      )
    case 'BOOLEAN':
      return (
        <div>
          <BooleanPrompt
            prompt={prompt}
            onSubmit={onSubmit}
            section={section}
          />
        </div>
      )
    case 'CHOICE':
      return (
        <div>
          <ChoicePrompt prompt={prompt} onSubmit={onSubmit} section={section} />
        </div>
      )
  }
}

function NumberPrompt({
  prompt,
  section,
  onSubmit,
}: {
  prompt: NumberPrompt
  section: SectionName
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  return <div>number prompt: {prompt.id}</div>
}

function BooleanPrompt({
  prompt,
  section,
  onSubmit,
}: {
  prompt: BooleanPrompt
  section: SectionName
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  return <div>boolean prompt: {prompt.id}</div>
}

function ChoicePrompt({
  prompt,
  section,
  onSubmit,
}: {
  prompt: ChoicePrompt
  section: SectionName
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  const [value, setValue] = useState<string | undefined>(undefined)

  return (
    <form
      onSubmit={e => {
        e.preventDefault()

        if (!value) {
          // TODO: handle validation
          return
        }

        onSubmit(q => ({
          ...q,
          [prompt.id]: value,
        }))
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
                  {option}
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
