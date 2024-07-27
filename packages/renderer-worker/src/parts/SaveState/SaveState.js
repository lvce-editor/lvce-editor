import * as InstanceStorage from '../InstanceStorage/InstanceStorage.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SerializeViewlet from '../SerializeViewlet/SerializeViewlet.js'
import * as SessionStorage from '../SessionStorage/SessionStorage.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

const getStateToSave = () => {
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

export const saveViewletState = async (id) => {
  const instance = ViewletStates.getInstance(id)
  const savedState = SerializeViewlet.serializeInstance(instance)
  await InstanceStorage.setJson(id, savedState)
  if (instance && instance.factory.saveChildState) {
    const childIds = instance.factory.saveChildState(instance.state)
    await Promise.all(childIds.map(saveViewletState))
  }
}

export const handleVisibilityChange = async (visibilityState) => {
  if (Workspace.isTest()) {
    return
  }
  if (visibilityState === 'hidden') {
    const stateToSave = getStateToSave()
    await Promise.all([
      InstanceStorage.setJson('workspace', stateToSave.workspace),
      InstanceStorage.setJsonObjects(stateToSave.instances),
      SessionStorage.setJson('workspace', stateToSave.workspace),
    ])
    // console.log('[renderer worker] state was saved')
  }
}

export const hydrate = async () => {
  // TODO should set up listener in renderer process
  if (!Preferences.get('workbench.saveStateOnVisibilityChange')) {
    console.info('[info] not saving state on visibility change - disabled by settings')
    return
  }
  await RendererProcess.invoke('Window.onVisibilityChange')
}

export const getSavedViewletState = (viewletId) => {
  return InstanceStorage.getJson(viewletId)
}
