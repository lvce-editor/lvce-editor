import * as ExtensionHostSubWorkerUrl from '../ExtensionHostSubWorkerUrl/ExtensionHostSubWorkerUrl.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.extensionHostSubWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || ExtensionHostSubWorkerUrl.extensionHostSubWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = ExtensionHostSubWorkerUrl.extensionHostSubWorkerUrl
  }
  return configuredWorkerUrl
}

export const getExtensionHostSubWorkerUrl = () => {
  return getConfiguredWorkerUrl()
}
