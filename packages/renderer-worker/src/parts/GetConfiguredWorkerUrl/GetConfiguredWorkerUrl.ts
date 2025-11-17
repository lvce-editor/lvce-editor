import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'

export const getConfiguredWorkerUrl = (preferenceKey: string, fallback: string) => {
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
