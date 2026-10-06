export type RuntimeConfig = {
  assetDir?: string
  platform?: number | 'electron' | 'remote' | 'web'
  workerUrls?: Readonly<Record<string, string>>
}

export const runtimeConfig: RuntimeConfig = {}

export const initialize = (config: RuntimeConfig = {}): void => {
  for (const key of Object.keys(runtimeConfig)) {
    delete runtimeConfig[key]
  }
  Object.assign(runtimeConfig, config)
}
