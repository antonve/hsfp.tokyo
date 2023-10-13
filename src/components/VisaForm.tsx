'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { z } from 'zod'

import { FormConfig, Prompt } from '@lib/domain/form'
import {
  Category,
  CategorySchema,
  Qualification,
} from '@lib/domain/qualifications'

const paramsSchema = z.object({
  category: CategorySchema.optional().default('academic-background'),
  prompt: z.coerce.number().optional().default(1),
})

interface Props {
  config: FormConfig
}

export function VisaForm({ config }: Props) {
  const params = useParams()
  const searchParams = useSearchParams()

  // TODO: extract to hook
  const qualifications = parseQualifications(searchParams.get('qualifications'))

  // TODO: figure out how to handle errors in nextjs 13
  const { category: currentCategory, prompt: currentPromptIndex } =
    paramsSchema.parse(params)

  return (
    <form>
      {config.order.map(section => (
        <VisaFormSection
          prompts={config.sections[section]!!}
          category={section}
        />
      ))}
    </form>
  )
}

function parseQualifications(
  encodedQualifications: string | null,
): Qualification[] {
  if (!encodedQualifications) {
    return []
  }

  const decodedQualifications = atob(encodedQualifications)
  const qualifications = JSON.parse(decodedQualifications)

  // TODO: implement after qualifcation type refactor
  return []
}

function VisaFormSection({
  prompts,
  category,
}: {
  prompts: Prompt[]
  category: Category
}) {
  return (
    <div className="pb-10">
      <h2 className="font-bold text-xl">{category}</h2>
      {prompts.map(prompt => (
        <VisaFromPrompt prompt={prompt} />
      ))}
    </div>
  )
}

function VisaFromPrompt({ prompt }: { prompt: Prompt }) {
  switch (prompt.type) {
    case 'NUMBER':
      return <div>number prompt: {prompt.id}</div>
    case 'BOOLEAN':
      return <div>bool prompt: {prompt.id}</div>
    case 'CHOICE':
      return <div>choice prompt: {prompt.id}</div>
  }
}
