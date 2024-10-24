import * as GetStateToSave from '../GetStateToSave/GetStateToSave.js'
import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'
import * as SessionStorage from '../SessionStorage/SessionStorage.js'
import * as Timestamp from '../Timestamp/Timestamp.js'
import * as VisibilityState from '../VisibilityState/VisibilityState.js'
import * as Workspace from '../Workspace/Workspace.js'

const getExtensionStateToSave = async () => {
  const items = {
    x: 1,
  }
  return items
}

const saveExtensionState = async () => {
  const state = await getExtensionStateToSave()
  await InstanceStorage.setJson('ExtensionState', state)
}

const saveBuiltinState = async () => {
  const stateToSave = GetStateToSave.getStateToSave()
  await Promise.all([
    InstanceStorage.setJson('workspace', stateToSave.workspace),
    InstanceStorage.setJsonObjects(stateToSave.instances),
    SessionStorage.setJson('workspace', stateToSave.workspace),
  ])
}

export const handleVisibilityChange = async (visibilityState) => {
  if (Workspace.isTest()) {
    return
  }
  if (visibilityState === VisibilityState.Hidden) {
    const builtinSaveStart = Timestamp.now()
    await saveBuiltinState()
    const builtinSaveEnd = Timestamp.now()
    await saveExtensionState()
    const extensionSaveEnd = Timestamp.now()
    await InstanceStorage.setJson('Timings', {
      builtinSaveTime: builtinSaveEnd - builtinSaveStart,
      extensionSaveTime: extensionSaveEnd - builtinSaveEnd,
    })
  }
}
