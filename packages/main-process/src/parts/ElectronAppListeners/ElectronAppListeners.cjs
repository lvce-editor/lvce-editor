const AppWindow = require('../AppWindow/AppWindow.cjs')
const Cli = require('../Cli/Cli.cjs')
const ParseCliArgs = require('../ParseCliArgs/ParseCliArgs.cjs')
const Debug = require('../Debug/Debug.cjs')
const ElectronApp = require('../ElectronApp/ElectronApp.cjs')
const ElectronBrowserViewState = require('../ElectronBrowserViewState/ElectronBrowserViewState.cjs')
const ElectronShell = require('../ElectronShell/ElectronShell.cjs')
const ElectronWebContentsEventType = require('../ElectronWebContentsEventType/ElectronWebContentsEventType.cjs')
const ElectronWindowOpenActionType = require('../ElectronWindowOpenActionType/ElectronWindowOpenActionType.cjs')
const LifeCycle = require('../LifeCycle/LifeCycle.cjs')
const Logger = require('../Logger/Logger.cjs')
const Platform = require('../Platform/Platform.cjs')
const Preferences = require('../Preferences/Preferences.cjs')

exports.handleWindowAllClosed = () => {
  Debug.debug('[info] all windows closed')
  if (!Platform.isMacOs) {
    Debug.debug('[info] quitting')
    ElectronApp.quit()
  }
}

exports.handleBeforeQuit = () => {
  LifeCycle.setShutDown()
  Debug.debug('[info] before quit')
}

// TODO maybe handle critical (first render) request via ipcMain
// and spawn shared process when page is idle/loaded
// currently launching shared process takes 170ms
// which means first paint is delayed by a lot

// map windows to folders and ports
// const windowConfigMap = new Map()

exports.handleReady = async (parsedArgs, workingDirectory) => {
  const preferences = await Preferences.load()
  await AppWindow.createAppWindow(preferences, parsedArgs, workingDirectory)
}

exports.handleSecondInstance = async (
  event,
  commandLine,
  workingDirectory,
  additionalData // additionalData is the actual process.argv https://github.com/electron/electron/pull/30891
) => {
  Debug.debug('[info] second instance')
  const parsedArgs = ParseCliArgs.parseCliArgs(additionalData)
  Debug.debug('[info] second instance args', additionalData, parsedArgs)
  const handled = Cli.handleFastCliArgsMaybe(parsedArgs) // TODO don't like the side effect here
  if (handled) {
    return
  }
  await exports.handleReady(parsedArgs, workingDirectory)
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
exports.handleWebContentsCreated = (event, webContents) => {
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
