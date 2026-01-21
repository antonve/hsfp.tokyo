import { VisaType } from '@lib/domain'
import { FormConfig, SectionNameSchema, VisaProgress } from '@lib/domain/form'
import {
  QualificationsSchema,
  decodeQualifications,
  generateSessionId,
} from '@lib/domain/qualifications'
import { formConfigForVisa } from './domain/form'
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
  locale: z.coerce.string(),
  section: SectionNameSchema.optional().default('education'),
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
    return QualificationsSchema.parse({
      v: visaType,
      completed: 0,
      s: generateSessionId(),
    })
  }

  const qualifications = decodeQualifications(encodedQualifications)

  // Default salary to 0 if missing to prevent calculation errors
  if (qualifications.salary === undefined) {
    qualifications.salary = 0
  }

  return qualifications
}

/**
 * Extracts the session ID from the current qualifications in the URL.
 * Returns the session ID or undefined if not present.
 */
export function useSessionId(): string | undefined {
  const searchParams = useSearchParams()
  const encodedQualifications = searchParams.get('q')

  if (!encodedQualifications) {
    return undefined
  }

  try {
    const qualifications = decodeQualifications(encodedQualifications)
    return qualifications.s
  } catch {
    return undefined
  }
}

export function useLanguage() {
  const params = useParams()
  const { locale } = paramsSchema.parse(params)

  return locale
}
