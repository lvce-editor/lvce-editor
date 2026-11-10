import * as IpcState from '../IpcState/IpcState.js'
import * as RuntimeConfig from '../RuntimeConfig/RuntimeConfig.ts'

export const shouldUsePreloadedWorker = (workerId: string): boolean => {
  if (!IpcState.getConfig()) {
    return false
  }
  const { preloadWorkers } = RuntimeConfig.runtimeConfig
  return !Array.isArray(preloadWorkers) || preloadWorkers.includes(workerId)
}
