import * as LocalStorage from '../LocalStorage/LocalStorage.js'
import * as MapObject from '../MapObject/MapObject.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SessionStorage from '../SessionStorage/SessionStorage.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

const serializeInstance = (instance) => {
  if (instance && instance.factory && instance.factory.saveState) {
    return instance.factory.saveState(instance.state)
  }
  return instance.state
}

const serializeInstances = (instances) => {
  const serialized = Object.create(null)
  for (const value of Object.values(instances)) {
    serialized[value.moduleId] = serializeInstance(value)
  }
  return serialized
}

const getStateToSave = () => {
  const instances = ViewletStates.getAllInstances()
  const savedInstances = serializeInstances(instances)
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
  const savedState = serializeInstance(instance)
  await LocalStorage.setJson(id, savedState)
}

export const handleVisibilityChange = async (visibilityState) => {
  if (Workspace.isTest()) {
    return
  }
  if (visibilityState === 'hidden') {
    const stateToSave = getStateToSave()
    await Promise.all([
      LocalStorage.setJson('workspace', stateToSave.workspace),
      LocalStorage.setJsonObjects(stateToSave.instances),
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

export const getSavedState = () => {
  if (Workspace.isTest()) {
    return undefined
  }
  return LocalStorage.getJson('stateToSave')
}

export const getSavedViewletState = (viewletId) => {
  return LocalStorage.getJson(viewletId)
}
