import { FC } from 'react'
import { useTranslation } from 'next-i18next'

import {
  AgeQualification,
  AnnualSalaryQualification,
  CareerQualification,
  Qualification,
  VisaType,
} from '@app/domain'
import { QualificationIds } from '@app/visa/b'
import QualificationList, {
  QualificationNumber,
} from '@app/components/QualificationList'
import FormSection from '@app/components/FormSection'

const ids = QualificationIds.Career

interface Props {
  visaType: VisaType
  qualifications: Qualification[]
  updateQualification: (qualification: Qualification) => void
}

const Career: FC<Props> = ({ qualifications, updateQualification }) => {
  const { t } = useTranslation()

  const createNewSalaryQualification = (
    value: number,
  ): AnnualSalaryQualification => ({
    category: 'ANNUAL_SALARY',
    id: 'salary',
    salary: value,
  })

  const createNewExperienceQualification = (
    value: number,
  ): CareerQualification => ({
    category: 'CAREER',
    id: 'experience',
    yearsOfExperience: value,
  })

  const createNewAgeQualification = (value: number): AgeQualification => ({
    category: 'AGE',
    id: 'age',
    age: value,
  })

  const onChangeFor = (
    createQualificationFunction: (value: number) => Qualification,
  ) => (value: number | undefined) => {
    if (value === undefined) {
      return
    }
    updateQualification(createQualificationFunction(value))
  }

  return (
    <FormSection
      title={t('simulation.career.title')}
      description={t('simulation.career.description')}
    >
      <QualificationList>
        <QualificationNumber
          qualifications={qualifications}
          category={`ANNUAL_SALARY`}
          id={ids.salary}
          onChange={onChangeFor(createNewSalaryQualification)}
          getValue={q => (q as AnnualSalaryQualification)?.salary}
          step={100_000}
          min={3_000_000}
        >
          <h3>{t('career.salary.name')}</h3>
          <p>{t('career.salary.description')}</p>
        </QualificationNumber>
        <QualificationNumber
          qualifications={qualifications}
          category={`CAREER`}
          id={ids.experience}
          onChange={onChangeFor(createNewExperienceQualification)}
          getValue={q => (q as CareerQualification)?.yearsOfExperience}
          min={0}
          max={60}
        >
          <h3>{t('career.experience.name')}</h3>
          <p>{t('career.experience.description')}</p>
        </QualificationNumber>
        <QualificationNumber
          qualifications={qualifications}
          category={`AGE`}
          id={ids.age}
          onChange={onChangeFor(createNewAgeQualification)}
          getValue={q => (q as AgeQualification)?.age}
          min={18}
          max={130}
        >
          <h3>{t('career.age.name')}</h3>
          <p>{t('career.age.description')}</p>
        </QualificationNumber>
      </QualificationList>
    </FormSection>
  )
}

export default Career
