import { useState, useEffect } from 'react'

import {
  containsQualificationWithId,
  Qualification,
  removeQualificationWithId,
} from '@app/domain'
import VisaSelect from '@app/components/VisaSelect'
import AcademicBackground from '@app/components/AcademicBackground'
import { VisaType } from '@app/domain'

const SimulationForm = () => {
  const [qualifications, setQualifications] = useState([] as Qualification[])

  const toggleQualification = (
    id: string,
    createNewQualification: (id: string) => Qualification,
  ) => {
    if (containsQualificationWithId(qualifications, id)) {
      return setQualifications(removeQualificationWithId(qualifications, id))
    }
    setQualifications([...qualifications, createNewQualification(id)])
  }

  useEffect(() => {
    console.log(qualifications)
  }, [qualifications])

  return (
    <>
      <VisaSelect />
      <AcademicBackground
        visaType={VisaType.B}
        qualifications={qualifications}
        toggleQualification={toggleQualification}
      />
    </>
  )
}

export default SimulationForm
