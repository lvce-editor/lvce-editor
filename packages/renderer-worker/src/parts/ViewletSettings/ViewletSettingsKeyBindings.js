import * as SettingsWorker from '../SettingsWorker/SettingsWorker.ts'

export const getKeyBindings = () => {
  return SettingsWorker.invoke('Settings.getKeyBindings')
}
