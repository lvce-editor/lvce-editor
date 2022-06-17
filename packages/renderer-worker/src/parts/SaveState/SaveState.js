import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
// import * as Main from '../Main/Main.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Json from '../Json/Json.js'
import * as Preferences from '../Preferences/Preferences.js'

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

export const hydrate = () => {
  // TODO should set up listener in renderer process
  if (!Preferences.get('workbench.saveStateOnVisibilityChange')) {
    // console.info(
    // '[info] not saving state on visibility change - disabled by settings'
    // )
    return
  }
  document.addEventListener('visibilitychange', () => {
    console.log('visibility changed')
    if (document.visibilityState === 'hidden') {
      const stateToSave = getStateToSave()
      localStorage.setItem('stateToSave', Json.stringify(stateToSave))
      sessionStorage.setItem('workspace', Json.stringify(stateToSave.workspace))
    }
  })
}
