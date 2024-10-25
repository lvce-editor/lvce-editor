import * as ExtensionHostState from '../ExtensionHost/ExtensionHostState.js'
import * as ExtensionStateStorage from '../ExtensionStateStorage/ExtensionStateStorage.js'

export const saveExtensionState = async () => {
  const state = await ExtensionHostState.saveState()
  await ExtensionStateStorage.setJson(state)
}
