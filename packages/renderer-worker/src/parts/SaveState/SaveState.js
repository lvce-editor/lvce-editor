import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
// import * as Main from '../Main/Main.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Json from '../Json/Json.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as LocalStorage from '../LocalStorage/LocalStorage.js'
import * as SessionStorage from '../SessionStorage/SessionStorage.js'

const getStateToSave = () => {
  const instances = Viewlet.state.instances
  // const mainEditors = Main.state.editors
  return {
    instances,
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
  console.log('[renderer worker] visibility changed to ', visibilityState)
  if (visibilityState === 'hidden') {
    const stateToSave = getStateToSave()
    await Promise.all([
      LocalStorage.setJson('stateToSave', stateToSave),
      SessionStorage.setJson('workspace', stateToSave.workspace),
    ])
    console.log('state was saved')
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
