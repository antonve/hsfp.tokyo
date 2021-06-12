import { FC } from 'react'

export const Checkbox: FC<{
  value: boolean
  onChange: (value: boolean) => void
}> = ({ value, onChange }) => (
  <input
    type="checkbox"
    className={`rounded`}
    checked={value}
    onChange={() => onChange(!value)}
  />
)
