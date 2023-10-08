// import { useState, useEffect } from 'react'

// import {
//   containsQualificationWithId,
//   Qualification,
//   removeQualificationWithId,
// } from '@lib/domain'
// import VisaSelect from '@components/VisaSelect'
// import AcademicBackground from '@components/AcademicBackground'
// import { VisaType } from '@lib/domain'
// import Licenses from '@components/Licenses'
// import Career from '@components/Career'

// const SimulationForm = () => {
//   const [qualifications, setQualifications] = useState([] as Qualification[])

//   const toggleQualification = (
//     id: string,
//     createNewQualification: (id: string) => Qualification,
//   ) => {
//     if (containsQualificationWithId(qualifications, id)) {
//       return setQualifications(removeQualificationWithId(qualifications, id))
//     }
//     setQualifications([...qualifications, createNewQualification(id)])
//   }

//   const selectQualificationForCategory = (qualification: Qualification) => {
//     const filteredQualifications = qualifications.filter(
//       q =>
//         !(q.category === qualification.category && q.id === qualification.id),
//     )
//     setQualifications([...filteredQualifications, qualification])
//   }

//   useEffect(() => {
//     console.log(qualifications)
//   }, [qualifications])

//   return (
//     <>
//       <VisaSelect />
//       <AcademicBackground
//         visaType={VisaType.B}
//         qualifications={qualifications}
//         toggleQualification={toggleQualification}
//       />
//       <Licenses
//         visaType={VisaType.B}
//         qualifications={qualifications}
//         selectQualificationForCategory={selectQualificationForCategory}
//       />
//       <Career
//         visaType={VisaType.B}
//         qualifications={qualifications}
//         updateQualification={selectQualificationForCategory}
//       />
//     </>
//   )
// }

// export default SimulationForm
