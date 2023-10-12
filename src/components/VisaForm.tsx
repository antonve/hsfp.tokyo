'use client'

import { useParams } from 'next/navigation'
import { z } from 'zod'

import { FormConfig } from '@lib/domain/form'
import { CategorySchema } from '@lib/domain/qualifications'

const paramsSchema = z.object({
  category: CategorySchema.optional().default('ACADEMIC_BACKGROUND'),
  prompt: z.coerce.number().optional().default(1),
})

interface Props {
  config: FormConfig
}

export function VisaForm({ config }: Props) {
  const params = useParams()

  // TODO: figure out how to handle errors in nextjs 13
  const { category: currentCategory, prompt: currentPromptIndex } =
    paramsSchema.parse(params)

  return `category: ${currentCategory}, prompt: ${currentPromptIndex}`
}
