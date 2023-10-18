import { VisaType } from '@lib/domain/calculator'
import { FormConfig, SectionNameSchema, VisaProgress } from '@lib/domain/form'
import {
  Qualifications,
  decodeQualifications,
  formConfigForVisa,
} from '@lib/visa'
import { notFound, useParams, useSearchParams } from 'next/navigation'
import { z } from 'zod'

export function useFormConfig(visa: string) {
  const formConfig = formConfigForVisa(visa)
  if (!formConfig) {
    notFound()
  }

  return formConfig
}

const paramsSchema = z.object({
  section: SectionNameSchema.optional().default('academic-background'),
  prompt: z.coerce.number().optional().default(1),
})

export function useVisaFormProgress(config: FormConfig) {
  const params = useParams()
  const { section, prompt } = paramsSchema.parse(params)

  if (config.sections[section] === undefined) {
    throw Error(`invalid section ${section}`)
  }
  if (config.sections[section]!!.length < prompt) {
    throw Error(`invalid prompt ${section}`)
  }

  return { section, promptIndex: prompt - 1 } as VisaProgress
}

export function useQualifications(visaType: VisaType) {
  const searchParams = useSearchParams()
  const encodedQualifications = searchParams.get('q')

  if (!encodedQualifications) {
    return { v: visaType } as Qualifications
  }

  return decodeQualifications(encodedQualifications)
}
