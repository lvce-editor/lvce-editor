import * as GetWorkspaceScopedViewletStates from '../GetWorkspaceScopedViewletStates/GetWorkspaceScopedViewletStates.js'
import * as SerializeViewlet from '../SerializeViewlet/SerializeViewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

export const getStateToSave = async () => {
  const instances = ViewletStates.getAllInstances()
  const savedInstances = await SerializeViewlet.serializeInstances(instances)
  const workspaceUri = Workspace.getWorkspaceUri()
  return {
    instances: GetWorkspaceScopedViewletStates.getWorkspaceScopedViewletStates(savedInstances, workspaceUri),
    mainEditors: [],
    workspace: {
      path: Workspace.state.workspacePath,
      homeDir: Workspace.state.homeDir,
      pathSeparator: Workspace.state.pathSeparator,
      uri: Workspace.state.workspaceUri,
    },
  }
}
