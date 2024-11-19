import * as GetStateToSave from '../GetStateToSave/GetStateToSave.js'
import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'
import * as SessionStorage from '../SessionStorage/SessionStorage.js'

export const saveBuiltinState = async () => {
  const stateToSave = await GetStateToSave.getStateToSave()
  await Promise.all([
    InstanceStorage.setJson('workspace', stateToSave.workspace),
    InstanceStorage.setJsonObjects(stateToSave.instances),
    SessionStorage.setJson('workspace', stateToSave.workspace),
  ])
}
