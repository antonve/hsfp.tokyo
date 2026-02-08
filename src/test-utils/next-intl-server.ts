// Minimal server-side stubs for unit tests.

export async function getTranslations() {
  return (key: string) => key
}

export function getRequestConfig<T extends (...args: any[]) => any>(fn: T) {
  return fn
}
