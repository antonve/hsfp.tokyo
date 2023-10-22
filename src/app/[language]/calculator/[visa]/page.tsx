'use client'

import { useFormConfig } from '@lib/hooks'
import { RedirectType, redirect } from 'next/navigation'

interface Props {
  params: {
    visa: string,
  }
}

export default function Page({ params }: Props) {
  const formConfig = useFormConfig(params.visa)
  const category = formConfig.order[0]
  redirect(`/calculator/${params.visa}/${category}/1`, RedirectType.replace)
}
