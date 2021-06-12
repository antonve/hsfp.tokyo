import { TFunction } from 'next-i18next'
import { VisaType } from '@app/domain'

export const localizeVisaType = (t: TFunction, type: VisaType): string =>
  t(`visaType.${type}`)
