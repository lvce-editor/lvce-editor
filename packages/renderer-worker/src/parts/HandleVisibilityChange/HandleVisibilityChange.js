import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'
import * as SaveBuiltinState from '../SaveBuiltinState/SaveBuiltinState.js'
import * as SaveExtensionState from '../SaveExtensionState/SaveExtensionState.js'
import * as Timestamp from '../Timestamp/Timestamp.js'
import * as VisibilityState from '../VisibilityState/VisibilityState.js'
import * as Workspace from '../Workspace/Workspace.js'

export const handleVisibilityChange = async (visibilityState) => {
  if (Workspace.isTest()) {
    return
  }
  if (visibilityState === VisibilityState.Hidden) {
    const builtinSaveStart = Timestamp.now()
    await SaveBuiltinState.saveBuiltinState()
    const builtinSaveEnd = Timestamp.now()
    await SaveExtensionState.saveExtensionState()
    const extensionSaveEnd = Timestamp.now()
    await InstanceStorage.setJson('Timings', {
      builtinSaveTime: builtinSaveEnd - builtinSaveStart,
      extensionSaveTime: extensionSaveEnd - builtinSaveEnd,
    })
  }
}
