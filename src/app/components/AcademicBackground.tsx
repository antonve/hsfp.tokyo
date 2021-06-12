import { useState, FC } from 'react'
import { useTranslation } from 'next-i18next'

import {
  containsQualificationWithId,
  Qualification,
  removeQualificationWithId,
  VisaType,
} from '@app/domain'
import { QualificationIds } from '@app/visa/b'

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

  return (
    <QualificationList>
      <QualificationOption value={ids.doctor} onChange={toggleQualification}>
        <h3>{t('academicBackground.bachelor.name')}</h3>
        <p>{t('academicBackground.bachelor.description')}</p>
      </QualificationOption>
    </QualificationList>
  )
}

interface QualificationOptionProps {
  value: string
  onChange: (value: string) => void
}

const QualificationOption: FC<QualificationOptionProps> = ({ children }) => (
  <div className="">{children}</div>
)

const QualificationList: FC<{}> = ({ children }) => (
  <div className="">{children}</div>
)

export default AcademicBackground
