'use client'

import { Criteria } from '@lib/domain'
import { formConfigForVisa } from '@lib/domain/form'
import { calculatePoints } from '@lib/domain/qualifications'
import { useQualifications } from '@lib/hooks'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

interface Props {
  params: {
    visa: string
  }
}

export default function Page({ params }: Props) {
  const t = useTranslations('results')

  const formConfig = formConfigForVisa(params.visa)!
  const qualifications = useQualifications(formConfig.visaType)
  const { points, matches } = useMemo(
    () => calculatePoints(qualifications),
    [qualifications],
  )

  return (
    <main className="space-y-8">
      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">{t('overview.title')}</h2>
        {points >= 70 ? (
          <div>{t('overview.qualified_banner', { points })}</div>
        ) : null}
        <MatchesOverview matches={matches} />
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-xl">{t('evidence.title')}</h3>
        <p className="text-zinc-300 max-w-2xl">
          {t('evidence.description', {
            visaType: t(`visa_type.${formConfig.visaType}`),
          })}
        </p>
      </section>
      <EvidenceOverview matches={matches} />
      <section className="space-y-4 max-w-2xl">
        <h3 className="font-semibold text-xl">
          {t('permanent_residency.title')}
        </h3>
        <p className="text-zinc-300">{t('permanent_residency.intro')}</p>
        <ul className="text-zinc-300 list-disc list-inside pl-4 space-y-2">
          <li> {t('permanent_residency.condition1')}</li>
          <li> {t('permanent_residency.condition2')}</li>
        </ul>
        <p className="text-zinc-300">{t('permanent_residency.visa_note')}</p>{' '}
        <p className="text-zinc-300">
          {t('permanent_residency.length_warning')}
        </p>
      </section>
    </main>
  )
}

function MatchesOverview({ matches }: { matches: Criteria[] }) {
  return 'todo'
}

function EvidenceOverview({ matches }: { matches: Criteria[] }) {
  return 'todo'
}
