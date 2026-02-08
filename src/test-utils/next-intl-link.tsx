import React from 'react'

export default function Link({
  href,
  children,
  ...props
}: React.PropsWithChildren<{ href: any; [key: string]: any }>) {
  const resolvedHref =
    typeof href === 'string' ? href : (href?.pathname ?? href?.toString?.() ?? '#')
  return (
    <a href={resolvedHref} {...props}>
      {children}
    </a>
  )
}

