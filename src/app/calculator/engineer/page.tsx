import { formConfig } from '@lib/visa/b'
import { redirect } from 'next/navigation'

export default function Page() {
  const category = formConfig.order[0]
  redirect(`/calculator/engineer/${category}/1`)
}
