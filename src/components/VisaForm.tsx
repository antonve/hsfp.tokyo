'use client'

import { FormConfig } from '@lib/domain/form'
import { useRouter } from 'next/navigation'

interface Props {
  config: FormConfig
}

export function VisaForm({ config }: Props) {
  const router = useRouter()

  return 'hello'
}
