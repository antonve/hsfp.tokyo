import { formConfig as formConfigA } from '@lib/visa/a'
import { formConfig as formConfigB } from '@lib/visa/b'
import { formConfig as formConfigC } from '@lib/visa/c'

export function formConfigForVisa(visa: string) {
  switch (visa) {
    case 'researcher':
      return formConfigA
    case 'engineer':
      return formConfigB
    case 'business-manager':
      return formConfigC
  }
}
