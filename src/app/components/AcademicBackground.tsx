import { FC } from 'react'
import { useTranslation } from 'next-i18next'

import { Qualification, VisaType } from '@app/domain'
import { QualificationIds } from '@app/visa/b'
import QualificationList, {
  QualificationOption,
} from '@app/components/QualificationList'
import FormSection from '@app/components/FormSection'

const ids = QualificationIds.AcademicBackground

interface Props {
  visaType: VisaType
  qualifications: Qualification[]
  toggleQualification: (
    id: string,
    createNewQualification: (id: string) => Qualification,
  ) => void
}

const AcademicBackground: FC<Props> = ({
  qualifications,
  toggleQualification,
}) => {
  const { t } = useTranslation()

  const createNewQualification = (id: string): Qualification => ({
    category: 'ACADEMIC_BACKGROUND',
    id,
  })

  const onChange = (id: string) =>
    toggleQualification(id, createNewQualification)

  return (
    <FormSection
      title={t('simulation.academicBackground.title')}
      description={t('simulation.academicBackground.description')}
    >
      <QualificationList>
        <QualificationOption
          qualifications={qualifications}
          id={ids.doctor}
          onChange={onChange}
        >
          <h3>{t('academicBackground.doctor.name')}</h3>
          <p>{t('academicBackground.doctor.description')}</p>
        </QualificationOption>
        <QualificationOption
          qualifications={qualifications}
          id={ids.master}
          onChange={onChange}
        >
          <h3>{t('academicBackground.master.name')}</h3>
          <p>{t('academicBackground.master.description')}</p>
        </QualificationOption>
      </QualificationList>
    </FormSection>
  )
}

export default AcademicBackground
