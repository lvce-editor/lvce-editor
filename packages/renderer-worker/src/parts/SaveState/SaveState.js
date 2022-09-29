import * as LocalStorage from '../LocalStorage/LocalStorage.js'
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

const mapObject = (object, fn) => {
  const mapFn = ([key, value]) => [key, fn(value)]
  return Object.fromEntries(Object.entries(object).map(mapFn))
}

const getStateToSave = () => {
  const instances = ViewletStates.getAllInstances()
  const savedInstances = mapObject(instances, serializeInstance)
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

export const handleVisibilityChange = async (visibilityState) => {
  if (visibilityState === 'hidden') {
    const stateToSave = getStateToSave()
    await Promise.all([
      LocalStorage.setJson('stateToSave', stateToSave),
      SessionStorage.setJson('workspace', stateToSave.workspace),
    ])
    console.log('[renderer worker] state was saved')
  }
}

export const hydrate = async () => {
  // TODO should set up listener in renderer process
  if (!Preferences.get('workbench.saveStateOnVisibilityChange')) {
    console.info(
      '[info] not saving state on visibility change - disabled by settings'
    )
    return
  }
  await RendererProcess.invoke('Window.onVisibilityChange')
}
