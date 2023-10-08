import { Simulation, VisaType } from '@lib/domain'
import { Qualification } from './domain/qualifications'

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
