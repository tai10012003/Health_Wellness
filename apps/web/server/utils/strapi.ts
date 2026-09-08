type StrapiFetchOptions = {
  path: string
  query?: Record<string, string | number | boolean | undefined>
}

export async function fetchFromStrapi<T>({ path, query }: StrapiFetchOptions): Promise<T> {
  const config = useRuntimeConfig()
  const baseUrl = String(config.public.strapiUrl || 'http://localhost:1337').replace(/\/$/, '')
  const headers: Record<string, string> = {}

  if (config.strapiApiToken) {
    headers.Authorization = `Bearer ${config.strapiApiToken}`
  }

  return await $fetch<T>(`${baseUrl}${path}`, {
    headers,
    query
  })
}

export function absoluteStrapiUrl(path?: string | null): string | undefined {
  if (!path) {
    return undefined
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const config = useRuntimeConfig()
  const baseUrl = String(config.public.strapiUrl || 'http://localhost:1337').replace(/\/$/, '')

  return `${baseUrl}${path}`
}
