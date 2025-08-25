import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SourceActionWorkerUrl from '../SourceActionWorkerUrl/SourceActionWorkerUrl.js'

export const getSourceActionWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.sourceActionWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || SourceActionWorkerUrl.sourceActionWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = SourceActionWorkerUrl.sourceActionWorkerUrl
  }
  return configuredWorkerUrl
}
