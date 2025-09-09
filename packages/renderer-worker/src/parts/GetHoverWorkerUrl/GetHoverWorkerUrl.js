import * as HoverWorkerUrl from '../HoverWorkerUrl/HoverWorkerUrl.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'

export const getHoverWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.hoverWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || HoverWorkerUrl.hoverWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = HoverWorkerUrl.hoverWorkerUrl
  }
  return configuredWorkerUrl
}
