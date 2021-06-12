import { TFunction } from 'next-i18next'
import { VisaType } from '@app/domain'

export const localizeVisaType = (t: TFunction, type: VisaType): string =>
  t(`visaType.${type}.name`)

export const localizeVisaTypeDescription = (
  t: TFunction,
  type: VisaType,
): string => t(`visaType.${type}.description`)
