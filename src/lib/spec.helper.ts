import { Simulation, Qualification, VisaType } from '@lib/domain'

export function simulationWithCriteriaB(
  qualifications: Qualification[],
): Simulation {
  return {
    visaType: VisaType.B,
    qualifications,
  }
}

export function simulationWithCriteriaC(
  qualifications: Qualification[],
): Simulation {
  return {
    visaType: VisaType.C,
    qualifications,
  }
}
