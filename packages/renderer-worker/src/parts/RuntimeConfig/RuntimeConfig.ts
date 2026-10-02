export type RuntimeConfig = {
  assetDir?: string
  platform?: number
  workerUrls?: Readonly<Record<string, string>>
}

export const parseRuntimeConfig = (url: string): RuntimeConfig => {
  const { searchParams } = new URL(url)
  const config = searchParams.get('config')
  if (!config) {
    return {}
  }
  return JSON.parse(config)
}

const getRuntimeConfig = (): RuntimeConfig => {
  if (typeof location === 'undefined' || typeof location.href !== 'string') {
    return {}
  }
  return parseRuntimeConfig(location.href)
}

export const runtimeConfig = getRuntimeConfig()
