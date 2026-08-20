import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RuntimeWorkerPaths from '../RuntimeWorkerPaths/RuntimeWorkerPaths.ts'

export const getConfiguredWorkerUrl = (preferenceKey: string, fallback: string) => {
  const runtimeWorkerUrl = RuntimeWorkerPaths.get(preferenceKey)
  if (runtimeWorkerUrl) {
    return runtimeWorkerUrl
  }
  let configuredWorkerUrl = Preferences.get(preferenceKey) || ''
  if (configuredWorkerUrl) {
    const configuredUrlWithSlash = configuredWorkerUrl.startsWith('/') ? configuredWorkerUrl : '/' + configuredWorkerUrl
    configuredWorkerUrl = '/remote' + configuredUrlWithSlash
  }
  configuredWorkerUrl = configuredWorkerUrl || fallback
  if (IsProduction.isProduction) {
    configuredWorkerUrl = fallback
  }
  return configuredWorkerUrl
}
