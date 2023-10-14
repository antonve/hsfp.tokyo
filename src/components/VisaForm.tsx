'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { z } from 'zod'

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
    <form>
      {config.order.map(category => (
        <VisaFormSection
          prompts={config.sections[category]!!}
          category={category}
          progress={progress}
        />
      ))}
    </form>
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
  prompts,
  category,
  progress,
}: {
  prompts: Prompt[]
  category: Category
  progress: VisaProgress
}) {
  return (
    <div className="pb-10">
      <h2 className="font-bold text-xl">{category}</h2>
      {prompts.map((prompt, i) => (
        <VisaFromPrompt
          prompt={prompt}
          isFocus={progress.category === category && progress.promptIndex === i}
        />
      ))}
    </div>
  )
}

function VisaFromPrompt({
  prompt,
  isFocus,
}: {
  prompt: Prompt
  isFocus: boolean
}) {
  switch (prompt.type) {
    case 'NUMBER':
      return (
        <div className={isFocus ? 'bg-stone-900' : ''}>
          <NumberPrompt prompt={prompt} />
        </div>
      )
    case 'BOOLEAN':
      return (
        <div className={isFocus ? 'bg-stone-900' : ''}>
          <BooleanPrompt prompt={prompt} />
        </div>
      )
    case 'CHOICE':
      return (
        <div className={isFocus ? 'bg-stone-900' : ''}>
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
  return (
    <form onSubmit={() => {}} className="space-y-4">
      {prompt.options.map((option, i) => (
        <div className="w-full">
          <input
            id={promptOptionId(prompt, option)}
            type="radio"
            onChange={() => {}}
            name={prompt.id}
          />
          <span className="">{getLetterForPosition(i)}</span>
          <label htmlFor={promptOptionId(prompt, option)}>{option}</label>
        </div>
      ))}
      <button type="submit">Continue</button>
    </form>
  )
}

function promptOptionId(prompt: Prompt, option: string) {
  return `${prompt.id}-${option}`
}

function getLetterForPosition(i: number) {
  return String.fromCharCode(65 + i)
}
