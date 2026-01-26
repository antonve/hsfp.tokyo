'use client'

import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface Props {
  visaSlug: string
}

export function OutdatedStateError({ visaSlug }: Props) {
  const t = useTranslations('outdated_state')

  const restartUrl = `/calculator/${visaSlug}`

  return (
    <div className="max-w-xl mx-auto text-center space-y-6 py-12">
      <div className="text-6xl">&#x1f4c5;</div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-gray-50">
        {t('title')}
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">{t('description')}</p>
      <Link
        href={restartUrl}
        className="button large justify-center no-underline inline-flex"
      >
        {t('restart_button')}
        <ArrowRightIcon className="w-5 h-5 ml-2" />
      </Link>
    </div>
  )
}
