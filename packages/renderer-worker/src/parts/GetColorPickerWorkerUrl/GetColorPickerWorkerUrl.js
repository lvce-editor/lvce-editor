import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as ColorPickerWorkerUrl from '../ColorPickerWorkerUrl/ColorPickerWorkerUrl.js'

export const getColorPickerWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.colorPickerWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || ColorPickerWorkerUrl.colorPickerWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = ColorPickerWorkerUrl.colorPickerWorkerUrl
  }
  return configuredWorkerUrl
}
