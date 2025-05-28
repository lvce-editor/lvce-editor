import * as FindWidgetWorkerUrl from '../FindWidgetWorkerUrl/FindWidgetWorkerUrl.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'

export const getFindWidgetWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.findWidgetWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || FindWidgetWorkerUrl.findWidgetWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = FindWidgetWorkerUrl.findWidgetWorkerUrl
  }
  return configuredWorkerUrl
}
