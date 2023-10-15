'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { ArrowRightIcon } from '@heroicons/react/20/solid'

import {
  BooleanPrompt,
  ChoicePrompt,
  FormConfig,
  NumberPrompt,
  Prompt,
} from '@lib/domain/form'
import {
  Category,
  CategorySchema,
  QualificationSchema,
} from '@lib/domain/qualifications'
import { useState } from 'react'
import cn from 'classnames'

interface Props {
  config: FormConfig
}

interface VisaProgress {
  category: Category
  promptIndex: number
}

export function VisaForm({ config }: Props) {
  const qualifications = useQualifications()
  const progress = useVisaFormProgress(config)

  return <VisaFormSection config={config} progress={progress} />
}

const paramsSchema = z.object({
  category: CategorySchema.optional().default('academic-background'),
  prompt: z.coerce.number().optional().default(1),
})

function useVisaFormProgress(config: FormConfig) {
  const params = useParams()
  const { category, prompt } = paramsSchema.parse(params)

  if (config.sections[category] === undefined) {
    throw Error(`invalid category ${category}`)
  }
  if (config.sections[category]!!.length < prompt) {
    throw Error(`invalid prompt ${category}`)
  }

  return { category, promptIndex: prompt - 1 } as VisaProgress
}

function useQualifications() {
  const searchParams = useSearchParams()
  const encodedQualifications = searchParams.get('qualifications')

  if (!encodedQualifications) {
    return []
  }

  const decodedQualifications = atob(encodedQualifications)
  const qualifications = JSON.parse(decodedQualifications)

  // TODO: figure out how to handle errors in nextjs 13
  return z.array(QualificationSchema).parse(qualifications)
}

function VisaFormSection({
  config,
  progress,
}: {
  config: FormConfig
  progress: VisaProgress
}) {
  const prompts = config.sections[progress.category]!!
  const prompt = prompts[progress.promptIndex]

  return (
    <div className="pb-10">
      <h2 className="font-bold text-xl mb-4">{progress.category}</h2>
      <VisaFormPrompt prompt={prompt} />
    </div>
  )
}

function VisaFormPrompt({ prompt }: { prompt: Prompt }) {
  switch (prompt.type) {
    case 'NUMBER':
      return (
        <div>
          <NumberPrompt prompt={prompt} />
        </div>
      )
    case 'BOOLEAN':
      return (
        <div>
          <BooleanPrompt prompt={prompt} />
        </div>
      )
    case 'CHOICE':
      return (
        <div>
          <ChoicePrompt prompt={prompt} />
        </div>
      )
  }
}

function NumberPrompt({ prompt }: { prompt: NumberPrompt }) {
  return <div>number prompt: {prompt.id}</div>
}

function BooleanPrompt({ prompt }: { prompt: BooleanPrompt }) {
  return <div>boolean prompt: {prompt.id}</div>
}

function ChoicePrompt({ prompt }: { prompt: ChoicePrompt }) {
  const [value, setValue] = useState<string | undefined>(undefined)

  return (
    <form>
      <div className="space-y-4 mb-8">
        {prompt.options.map((option, i) => (
          <div className="w-full">
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
                  onChange={e => setValue(option)}
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
