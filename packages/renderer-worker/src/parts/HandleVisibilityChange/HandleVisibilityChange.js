import * as GetStateToSave from '../GetStateToSave/GetStateToSave.js'
import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'
import * as SessionStorage from '../SessionStorage/SessionStorage.js'
import * as Workspace from '../Workspace/Workspace.js'

export const handleVisibilityChange = async (visibilityState) => {
  if (Workspace.isTest()) {
    return
  }
  if (visibilityState === 'hidden') {
    const stateToSave = GetStateToSave.getStateToSave()
    await Promise.all([
      InstanceStorage.setJson('workspace', stateToSave.workspace),
      InstanceStorage.setJsonObjects(stateToSave.instances),
      SessionStorage.setJson('workspace', stateToSave.workspace),
    ])
    // console.log('[renderer worker] state was saved')
  }
}
