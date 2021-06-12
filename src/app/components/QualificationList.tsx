import { FC } from 'react'

import {
  containsMatchingQualification,
  containsQualificationWithId,
  Qualification,
} from '@app/domain'
import { Checkbox, RadioButton } from '@app/components/Form'
import classNames from 'classnames'

interface QualificationOptionProps {
  qualifications: Qualification[]
  id: string
  onChange: (value: string) => void
}

export const QualificationOption: FC<QualificationOptionProps> = ({
  children,
  qualifications,
  id,
  onChange,
}) => {
  const checked = containsQualificationWithId(qualifications, id)
  const containerClasses = classNames(
    'py-2 px-4 flex cursor-pointer select-none',
    {
      'bg-indigo-400': checked,
    },
  )

  return (
    <label className={containerClasses}>
      <div className="flex-grow">{children}</div>
      <div className="flex content-center items-center">
        <Checkbox value={checked} onChange={() => onChange(id)} />
      </div>
    </label>
  )
}

interface QualificationRadioProps {
  qualifications: Qualification[]
  match: (qualification: Qualification) => boolean
  onChange: () => void
}

export const QualificationRadio: FC<QualificationRadioProps> = ({
  children,
  qualifications,
  match,
  onChange,
}) => {
  const checked = containsMatchingQualification(qualifications, match)
  const containerClasses = classNames(
    'py-2 px-4 flex cursor-pointer select-none',
    {
      'bg-indigo-400': checked,
    },
  )

  return (
    <label className={containerClasses}>
      <div className="flex-grow">{children}</div>
      <div className="flex content-center items-center">
        <RadioButton value={checked} onChange={onChange} />
      </div>
    </label>
  )
}

const QualificationList: FC<{}> = ({ children }) => (
  <div className="grid grid-cols-1 w-full rounded-md border-4 border-indigo-400 divide-y divide-y-8">
    {children}
  </div>
)

export default QualificationList
