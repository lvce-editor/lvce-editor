import * as RuntimeConfig from '../RuntimeConfig/RuntimeConfig.ts'

const state: { paths: Readonly<Record<string, string>> } = {
  paths: RuntimeConfig.runtimeConfig.workerUrls || {},
}

export const initialize = (paths: Readonly<Record<string, string>> = {}): void => {
  state.paths = paths
}

export const get = (key: string): string => {
  const { paths } = state
  return paths[key] || ''
}
