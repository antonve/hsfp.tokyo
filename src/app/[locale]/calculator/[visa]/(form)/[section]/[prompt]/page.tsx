'use client'

import { VisaForm } from '@components/VisaForm'
import { formConfigForVisa } from '@lib/domain/form'

interface Props {
  params: {
    visa: string
  }
}

export default function Page({ params }: Props) {
  const formConfig = formConfigForVisa(params.visa)!

  return <VisaForm config={formConfig!} />
}
