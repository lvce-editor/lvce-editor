import * as SettingsWorker from '../SettingsWorker/SettingsWorker.ts'

export const saveState = async (state) => {
  const savedState = await SettingsWorker.invoke('Settings.saveState', state.uid)
  return savedState
}
