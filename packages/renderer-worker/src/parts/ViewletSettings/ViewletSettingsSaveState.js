import * as SettingsViewWorker from '../SettingsViewWorker/SettingsViewWorker.js'

export const saveState = async (state) => {
  const savedState = await SettingsViewWorker.invoke('Settings.saveState', state.uid)
  return savedState
}
