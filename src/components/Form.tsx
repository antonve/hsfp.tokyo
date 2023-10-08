// import { FC } from 'react'

// export const Checkbox: FC<{
//   value: boolean
//   onChange: (value: boolean) => void
// }> = ({ value, onChange }) => (
//   <input
//     type="checkbox"
//     className={`rounded`}
//     checked={value}
//     onChange={() => onChange(!value)}
//   />
// )

// export const RadioButton: FC<{
//   value: boolean
//   onChange: (value: boolean) => void
// }> = ({ value, onChange }) => (
//   <input
//     type="radio"
//     className={`rounded-full`}
//     checked={value}
//     onChange={() => onChange(!value)}
//   />
// )

// export const NumberInput: FC<{
//   value: number | undefined
//   onChange: (value: number) => void
//   step?: number
//   min?: number
//   max?: number
// }> = ({ value, onChange, step, min, max }) => (
//   <input
//     type="number"
//     className={'rounded w-full'}
//     value={value ?? ''}
//     onChange={event => {
//       const updatedValue = parseInt(event.target.value, 10)
//       onChange(isNaN(updatedValue) ? 0 : updatedValue)
//     }}
//     step={step ?? 1}
//     min={min}
//     max={max}
//   />
// )
