import { useState, FC } from 'react'
import { useTranslation } from 'next-i18next'
import classNames from 'classnames'

import { VisaType } from '@app/domain'
import { localizeVisaType, localizeVisaTypeDescription } from '@app/localize'

const VisaSelect: FC<{}> = () => {
  const [visaType, setVisaType] = useState(undefined as undefined | VisaType)

  return (
    <div className="w-full flex rounded-md border-4 border-indigo-400">
      <VisaOption
        type={VisaType.A}
        selectedType={visaType}
        onSelect={setVisaType}
      />
      <VisaOption
        type={VisaType.B}
        selectedType={visaType}
        onSelect={setVisaType}
      />
      <VisaOption
        type={VisaType.C}
        selectedType={visaType}
        onSelect={setVisaType}
      />
    </div>
  )
}

interface VisaOptionProps {
  type: VisaType
  selectedType: VisaType | undefined
  onSelect: (value: VisaType) => void
}

const VisaOption: FC<VisaOptionProps> = ({
  type,
  description,
  selectedType,
  onSelect,
}) => {
  const classes = classNames('flex-1 py-4 px-8 focus:outline-none', {
    'bg-indigo-400 text-white': type === selectedType,
  })
  const { t } = useTranslation()

  return (
    <button href="#" onClick={() => onSelect(type)} className={classes}>
      <h3>{localizeVisaType(t, type)}</h3>
      <p className={`text-sm`}>{localizeVisaTypeDescription(t, type)}</p>
    </button>
  )
}

export default VisaSelect
