import * as SettingsViewWorker from '../SettingsViewWorker/SettingsViewWorker.js'

export const getKeyBindings = () => {
  return SettingsViewWorker.invoke('Settings.getKeyBindings')
}
