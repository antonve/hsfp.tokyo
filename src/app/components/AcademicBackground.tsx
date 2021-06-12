import { useState, FC, useEffect } from 'react'
import { useTranslation } from 'next-i18next'

import {
  containsQualificationWithId,
  Qualification,
  removeQualificationWithId,
  VisaType,
} from '@app/domain'
import { QualificationIds } from '@app/visa/b'
import QualificationList, { QualificationOption } from './QualificationList'

const ids = QualificationIds.AcademicBackground

interface Props {
  visaType: VisaType
}

const AcademicBackground: FC<Props> = () => {
  const [qualifications, setQualifications] = useState([] as Qualification[])
  const { t } = useTranslation()

  const toggleQualification = (id: string) => {
    if (containsQualificationWithId(qualifications, id)) {
      return setQualifications(removeQualificationWithId(qualifications, id))
    }

    const newQualification: Qualification = {
      category: 'ACADEMIC_BACKGROUND',
      id,
    }
    setQualifications([...qualifications, newQualification])
  }

  useEffect(() => {
    console.log(qualifications)
  }, [qualifications])

  return (
    <QualificationList>
      <QualificationOption
        qualifications={qualifications}
        id={ids.doctor}
        onChange={toggleQualification}
      >
        <h3>{t('academicBackground.doctor.name')}</h3>
        <p>{t('academicBackground.doctor.description')}</p>
      </QualificationOption>
      <QualificationOption
        qualifications={qualifications}
        id={ids.master}
        onChange={toggleQualification}
      >
        <h3>{t('academicBackground.master.name')}</h3>
        <p>{t('academicBackground.master.description')}</p>
      </QualificationOption>
    </QualificationList>
  )
}

export default AcademicBackground
