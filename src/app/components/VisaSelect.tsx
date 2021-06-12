import { useState, FC } from 'react'
import classNames from 'classnames'

import { VisaType } from '@app/domain'

const VisaSelect: FC<{}> = () => {
  const [visaType, setVisaType] = useState(undefined as undefined | VisaType)

  return (
    <div className="w-full flex rounded-md border-4 border-indigo-400">
      <VisaOption
        type={VisaType.A}
        description={'aa'}
        selectedType={visaType}
        onSelect={setVisaType}
      />
      <VisaOption
        type={VisaType.B}
        description={'aa'}
        selectedType={visaType}
        onSelect={setVisaType}
      />
      <VisaOption
        type={VisaType.C}
        description={'aa'}
        selectedType={visaType}
        onSelect={setVisaType}
      />
    </div>
  )
}

interface VisaOptionProps {
  type: VisaType
  description: string
  selectedType: VisaType | undefined
  onSelect: (value: VisaType) => void
}

const VisaOption: FC<VisaOptionProps> = ({
  type,
  description,
  selectedType,
  onSelect,
}) => {
  const classes = classNames('flex-1 py-4 px-8', {
    'bg-indigo-400 text-white': type === selectedType,
  })
  return (
    <a href="#" onClick={() => onSelect(type)} className={classes}>
      <h3>{type}</h3>
      <p>{description}</p>
    </a>
  )
}

export default VisaSelect
