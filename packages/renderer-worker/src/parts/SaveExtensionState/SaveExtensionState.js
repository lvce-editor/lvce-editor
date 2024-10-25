import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'
import * as ExtensionHostState from '../ExtensionHost/ExtensionHostState.js'

export const saveExtensionState = async () => {
  const state = await ExtensionHostState.saveState()
  await InstanceStorage.setJson('ExtensionState', state)
}
