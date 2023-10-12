import { formConfig } from '@lib/visa/b'
import { redirect } from 'next/navigation'

export default function page() {
  const category = formConfig.order[0]
  redirect(`/calculator/engineer/${category}/1`)
}
