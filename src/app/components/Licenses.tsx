import { FC } from 'react'
import { useTranslation } from 'next-i18next'

import { LicensesQualification, Qualification, VisaType } from '@app/domain'
import QualificationList, { QualificationRadio } from './QualificationList'

interface Props {
  visaType: VisaType
  qualifications: Qualification[]
  selectQualificationForCategory: (qualification: Qualification) => void
}

type MatchFunction = (qualification: Qualification) => boolean

const Licenses: FC<Props> = ({
  qualifications,
  selectQualificationForCategory,
}) => {
  const { t } = useTranslation()

  const createNewQualification = (count: number): LicensesQualification => ({
    category: 'LICENSES',
    id: 'licenses',
    count,
  })

  const onChangeFor = (count: number) => () =>
    selectQualificationForCategory(createNewQualification(count))

  const matcherFor = (count: number): MatchFunction => (
    qualification: Qualification,
  ) =>
    qualification.category === 'LICENSES' &&
    qualification.id === 'licenses' &&
    (qualification as LicensesQualification).count === count

  return (
    <QualificationList>
      <QualificationRadio
        qualifications={qualifications}
        onChange={onChangeFor(0)}
        match={matcherFor(0)}
      >
        <h3>{t('licenses.none.name')}</h3>
        <p>{t('licenses.none.description')}</p>
      </QualificationRadio>
      <QualificationRadio
        qualifications={qualifications}
        onChange={onChangeFor(1)}
        match={matcherFor(1)}
      >
        <h3>{t('licenses.one.name')}</h3>
        <p>{t('licenses.one.description')}</p>
      </QualificationRadio>
      <QualificationRadio
        qualifications={qualifications}
        onChange={onChangeFor(2)}
        match={matcherFor(2)}
      >
        <h3>{t('licenses.two_or_more.name')}</h3>
        <p>{t('licenses.two_or_more.description')}</p>
      </QualificationRadio>
    </QualificationList>
  )
}

export default Licenses
