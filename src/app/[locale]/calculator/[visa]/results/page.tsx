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
  const t = useTranslations('visa_form.results')

  const formConfig = formConfigForVisa(params.visa)!
  const qualifications = useQualifications(formConfig.visaType)
  const { points, matches } = useMemo(
    () => calculatePoints(qualifications),
    [qualifications],
  )

  return (
    <>
      <h2>{t('overview.title')}</h2>
      {points >= 70 ? (
        <div>{t('overview.qualified_banner', { points })}</div>
      ) : null}
      <MatchesOverview matches={matches} />
      <h3>{t('evidence.title')}</h3>
      <EvidenceOverview matches={matches} />
    </>
  )
}

function MatchesOverview({ matches }: { matches: Criteria[] }) {
  return 'todo'
}

function EvidenceOverview({ matches }: { matches: Criteria[] }) {
  return 'todo'
}
