import * as SerializeViewlet from '../SerializeViewlet/SerializeViewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

export const getStateToSave = () => {
  const instances = ViewletStates.getAllInstances()
  const savedInstances = SerializeViewlet.serializeInstances(instances)
  return {
    instances: savedInstances,
    mainEditors: [],
    workspace: {
      path: Workspace.state.workspacePath,
      homeDir: Workspace.state.homeDir,
      pathSeparator: Workspace.state.pathSeparator,
      uri: Workspace.state.workspaceUri,
    },
  }
}
