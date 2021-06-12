import { FC } from 'react'

import { containsQualificationWithId, Qualification } from '@app/domain'
import { Checkbox } from '@app/components/Form'
import classNames from 'classnames'

interface Props {
  qualifications: Qualification[]
  id: string
  onChange: (value: string) => void
}

export const QualificationOption: FC<Props> = ({
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

const QualificationList: FC<{}> = ({ children }) => (
  <div className="grid grid-cols-1 w-full rounded-md border-4 border-indigo-400 divide-y divide-y-8">
    {children}
  </div>
)

export default QualificationList
