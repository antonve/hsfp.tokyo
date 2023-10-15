'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
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
  Qualification,
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

  return (
    <VisaFormSection
      config={config}
      progress={progress}
      qualifications={qualifications}
    />
  )
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
  const encodedQualifications = searchParams.get('q')

  if (!encodedQualifications) {
    return []
  }

  const decodedQualifications = atob(encodedQualifications)
  const qualifications = JSON.parse(decodedQualifications)

  // TODO: figure out how to handle errors in nextjs 13
  return z.array(QualificationSchema).parse(qualifications)
}

function nextStepOfForm(formConfig: FormConfig, progress: VisaProgress) {
  const currentSection = formConfig.sections[progress.category]!!
  const shouldUseNextCategory =
    currentSection.length <= progress.promptIndex + 1
  const promptIndex = shouldUseNextCategory ? 0 : progress.promptIndex + 1
  const currentCategoryIndex = formConfig.order.findIndex(
    it => it === progress.category,
  )
  const category = shouldUseNextCategory
    ? formConfig.order[currentCategoryIndex + 1]
    : progress.category

  return {
    category,
    promptIndex,
  } as VisaProgress
}

function VisaFormSection({
  config,
  progress,
  qualifications,
}: {
  config: FormConfig
  progress: VisaProgress
  qualifications: Qualification[]
}) {
  const router = useRouter()
  const params = useParams()

  const prompts = config.sections[progress.category]!!
  const prompt = prompts[progress.promptIndex]

  const submit = (newQualification: Qualification) => {
    const { category, promptIndex } = nextStepOfForm(config, progress)
    const q = qualifications.filter(
      it =>
        !(
          it.category === newQualification.category &&
          it.id === newQualification.id
        ),
    )
    q.push(newQualification)
    const qq = JSON.stringify(q)
    const qqq = btoa(qq)

    router.push(
      `/calculator/${params['visa']}/${category}/${promptIndex + 1}?q=${qqq}`,
    )
  }

  return (
    <div className="pb-10">
      <h2 className="font-bold text-xl mb-4">{progress.category}</h2>
      <VisaFormPrompt
        prompt={prompt}
        onSubmit={submit}
        category={progress.category}
      />
    </div>
  )
}

function VisaFormPrompt({
  prompt,
  category,
  onSubmit,
}: {
  prompt: Prompt
  category: Category
  onSubmit: (newQualification: Qualification) => void
}) {
  switch (prompt.type) {
    case 'NUMBER':
      return (
        <div>
          <NumberPrompt
            prompt={prompt}
            onSubmit={onSubmit}
            category={category}
          />
        </div>
      )
    case 'BOOLEAN':
      return (
        <div>
          <BooleanPrompt
            prompt={prompt}
            onSubmit={onSubmit}
            category={category}
          />
        </div>
      )
    case 'CHOICE':
      return (
        <div>
          <ChoicePrompt
            prompt={prompt}
            onSubmit={onSubmit}
            category={category}
          />
        </div>
      )
  }
}

function NumberPrompt({
  prompt,
  category,
  onSubmit,
}: {
  prompt: NumberPrompt
  category: Category
  onSubmit: (newQualification: Qualification) => void
}) {
  return <div>number prompt: {prompt.id}</div>
}

function BooleanPrompt({
  prompt,
  category,
  onSubmit,
}: {
  prompt: BooleanPrompt
  category: Category
  onSubmit: (newQualification: Qualification) => void
}) {
  return <div>boolean prompt: {prompt.id}</div>
}

function ChoicePrompt({
  prompt,
  category,
  onSubmit,
}: {
  prompt: ChoicePrompt
  category: Category
  onSubmit: (newQualification: Qualification) => void
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

        const qualification: Qualification = {
          category,
          id: value,
        }

        onSubmit(qualification)
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
