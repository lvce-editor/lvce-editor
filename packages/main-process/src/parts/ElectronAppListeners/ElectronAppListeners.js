import * as AppWindow from '../AppWindow/AppWindow.js'
import * as Cli from '../Cli/Cli.js'
import * as Debug from '../Debug/Debug.js'
import * as ElectronApp from '../ElectronApp/ElectronApp.js'
import * as ElectronBrowserViewState from '../ElectronBrowserViewState/ElectronBrowserViewState.js'
import * as ElectronShell from '../ElectronShell/ElectronShell.js'
import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.js'
import * as ElectronWindowOpenActionType from '../ElectronWindowOpenActionType/ElectronWindowOpenActionType.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as Logger from '../Logger/Logger.js'
import * as ParseCliArgs from '../ParseCliArgs/ParseCliArgs.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'

// TODO move this function to shared process
export const handleWindowAllClosed = () => {
  Debug.debug('[info] all windows closed')
  if (!Platform.isMacOs) {
    Debug.debug('[info] quitting')
    ElectronApp.quit()
  }
}

// TODO move this function to shared process
export const handleBeforeQuit = () => {
  LifeCycle.setShutDown()
  Debug.debug('[info] before quit')
}

// TODO maybe handle critical (first render) request via ipcMain
// and spawn shared process when page is idle/loaded
// currently launching shared process takes 170ms
// which means first paint is delayed by a lot

// map windows to folders and ports
// const windowConfigMap = new Map()

export const handleReady = async (parsedArgs, workingDirectory) => {
  // TODO move preferences loading and window creation to shared process
  const preferences = await Preferences.load()
  await AppWindow.createAppWindow(preferences, parsedArgs, workingDirectory)
}

export const handleSecondInstance = async (
  event,
  commandLine,
  workingDirectory,
  additionalData, // additionalData is the actual process.argv https://github.com/electron/electron/pull/30891
) => {
  Debug.debug('[info] second instance')
  const parsedArgs = ParseCliArgs.parseCliArgs(additionalData)
  Debug.debug('[info] second instance args', additionalData, parsedArgs)
  const handled = Cli.handleFastCliArgsMaybe(parsedArgs) // TODO don't like the side effect here
  if (handled) {
    return
  }
  await handleReady(parsedArgs, workingDirectory)
}

const handleWebContentsWindowOpen = ({ url }) => {
  ElectronShell.openExternal(url)
  return {
    action: ElectronWindowOpenActionType.Deny,
  }
}

/**
 *
 * @param {*} event
 * @param {Electron.WebContents} webContents
 */
export const handleWebContentsCreated = (event, webContents) => {
  /**
   *
   * @param {import('electron').Event<import('electron').WebContentsWillNavigateEventParams>} event
   * @returns
   */
  const handleWebContentsNavigate = (event) => {
    if (ElectronBrowserViewState.hasWebContents(webContents.id)) {
      return
    }
    Logger.error('[main-process] Prevented webcontent navigation')
    event.preventDefault()
  }
  webContents.on(ElectronWebContentsEventType.WillNavigate, handleWebContentsNavigate)
  webContents.setWindowOpenHandler(handleWebContentsWindowOpen)
}
