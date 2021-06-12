import { useState, FC, useEffect } from 'react'
import { useTranslation } from 'next-i18next'

import {
  containsQualificationWithId,
  Qualification,
  removeQualificationWithId,
  VisaType,
} from '@app/domain'
import { QualificationIds } from '@app/visa/b'
import { Checkbox } from '@app/components/Form'

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
        <h3>{t('academicBackground.bachelor.name')}</h3>
        <p>{t('academicBackground.bachelor.description')}</p>
      </QualificationOption>
    </QualificationList>
  )
}

interface QualificationOptionProps {
  qualifications: Qualification[]
  id: string
  onChange: (value: string) => void
}

const QualificationOption: FC<QualificationOptionProps> = ({
  children,
  qualifications,
  id,
  onChange,
}) => (
  <div className="">
    <div>{children}</div>
    <div>
      <Checkbox
        value={containsQualificationWithId(qualifications, id)}
        onChange={() => onChange(id)}
      />
    </div>
  </div>
)

const QualificationList: FC<{}> = ({ children }) => (
  <div className="">{children}</div>
)

export default AcademicBackground
