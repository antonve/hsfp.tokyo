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

  // &#x1f389; tada
  const visaType = t(`visa_type.${formConfig.visaType}`)

  return (
    <main className="space-y-8">
      {points >= 70 ? (
        <div className=" p-[2px] font-semibold rounded-lg bg-gradient-to-r from-emerald-300 from-10% to-emerald-500 to-90% relative">
          <span className="absolute -top-3 -left-2 text-4xl"> &#x1f389;</span>
          <span className="absolute -bottom-3 -right-3 text-4xl">
            &#128640;
          </span>
          <div className="bg-zinc-950/80 px-6 py-4 rounded-lg">
            {t('banner.qualified', { visaType })}
          </div>
        </div>
      ) : null}
      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">{t('overview.title')}</h2>
        <MatchesOverview matches={matches} />
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-xl">{t('evidence.title')}</h3>
        <p className="text-zinc-300 max-w-2xl">
          {t('evidence.description', {
            visaType,
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
