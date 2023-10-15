import { formConfigForVisa } from '@lib/visa/config'
import { notFound } from 'next/navigation'

export function useFormConfig(visa: string) {
  const formConfig = formConfigForVisa(visa)
  if (!formConfig) {
    notFound()
  }

  return formConfig
}
