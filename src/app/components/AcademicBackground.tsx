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
import classNames from 'classnames'

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
}) => {
  const checked = containsQualificationWithId(qualifications, id)
  const containerClasses = classNames(
    'py-2 px-4 flex cursor-pointer select-none',
    {
      'bg-indigo-400': checked,
    },
  )

  return (
    <label className={containerClasses}>
      <div className="flex-grow">{children}</div>
      <div className="flex content-center items-center">
        <Checkbox value={checked} onChange={() => onChange(id)} />
      </div>
    </label>
  )
}

const QualificationList: FC<{}> = ({ children }) => (
  <div className="grid grid-cols-1 w-full rounded-md border-4 border-indigo-400 divide-y divide-y-8">
    {children}
  </div>
)

export default AcademicBackground
