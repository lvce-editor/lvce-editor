import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RenameWorkerUrl from '../RenameWorkerUrl/RenameWorkerUrl.js'

export const getRenameWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.renameWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || RenameWorkerUrl.renameWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = RenameWorkerUrl.renameWorkerUrl
  }
  return configuredWorkerUrl
}
