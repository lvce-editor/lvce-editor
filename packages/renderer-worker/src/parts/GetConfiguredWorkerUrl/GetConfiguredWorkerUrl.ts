import * as ConfigState from '../ConfigState/ConfigState.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfigKey = (preferenceKey: string) => {
  const key = preferenceKey.split('.').at(-1) || ''
  return key.replace(/Path$/, 'Url')
}

export const getConfiguredWorkerUrl = (preferenceKey: string, fallback: string) => {
  const configuredUrlFromConfig = ConfigState.get(getConfigKey(preferenceKey))
  let configuredWorkerUrl = configuredUrlFromConfig
  if (!configuredWorkerUrl) {
    const configuredUrlFromPreferences = Preferences.get(preferenceKey) || ''
    if (configuredUrlFromPreferences) {
      const configuredUrlWithSlash = configuredUrlFromPreferences.startsWith('/') ? configuredUrlFromPreferences : '/' + configuredUrlFromPreferences
      configuredWorkerUrl = '/remote' + configuredUrlWithSlash
    }
  }
  configuredWorkerUrl = configuredWorkerUrl || fallback
  if (IsProduction.isProduction) {
    configuredWorkerUrl = fallback
  }
  return configuredWorkerUrl
}
