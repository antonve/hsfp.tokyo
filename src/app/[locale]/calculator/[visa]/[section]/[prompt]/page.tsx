'use client'

import { VisaForm } from '@components/VisaForm'
import { formConfigForVisa } from '@lib/domain/form'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    visa: string
  }
}

export default function Page({ params }: Props) {
  const formConfig = formConfigForVisa(params.visa)
  if (!formConfig) {
    notFound()
  }

  return <VisaForm config={formConfig} />
}
