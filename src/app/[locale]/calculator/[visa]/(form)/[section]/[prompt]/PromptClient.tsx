'use client'

import { VisaForm } from '@components/VisaForm'
import { formConfigForVisa } from '@lib/domain/form'

interface Props {
  visa: string
}

export default function PromptClient({ visa }: Props) {
  const formConfig = formConfigForVisa(visa)!

  return <VisaForm config={formConfig!} />
}
