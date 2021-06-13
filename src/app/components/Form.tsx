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

export const RadioButton: FC<{
  value: boolean
  onChange: (value: boolean) => void
}> = ({ value, onChange }) => (
  <input
    type="radio"
    className={`rounded-full`}
    checked={value}
    onChange={() => onChange(!value)}
  />
)

export const NumberInput: FC<{
  value: number
  onChange: (value: number) => void
  step?: number
}> = ({ value, onChange, step }) => (
  <input
    type="number"
    className={`rounded`}
    value={value}
    onChange={event => {
      const updatedValue = parseInt(event.target.value, 10)
      onChange(isNaN(updatedValue) ? 0 : updatedValue)
    }}
    step={step ?? 1}
  />
)
