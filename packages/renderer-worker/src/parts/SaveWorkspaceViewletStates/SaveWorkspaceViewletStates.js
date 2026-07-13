import * as GetStateToSave from '../GetStateToSave/GetStateToSave.js'
import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'

export const saveWorkspaceViewletStates = async () => {
  const stateToSave = await GetStateToSave.getStateToSave()
  await InstanceStorage.setJsonObjects(stateToSave.instances)
}
