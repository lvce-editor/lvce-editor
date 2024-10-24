import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as ExtensionStateStorage from '../ExtensionStateStorage/ExtensionStateStorage.js'

export const saveState = async () => {
  const state = await ExtensionHostWorker.invoke('SaveState.saveState')
  return state
}

export const getSavedState = async () => {
  const value = await ExtensionStateStorage.getJson()
  return value
}
