const AppWindow = require('../AppWindow/AppWindow.js')
const Cli = require('../Cli/Cli.js')
const Debug = require('../Debug/Debug.js')
const ElectronApp = require('../ElectronApp/ElectronApp.js')
const ElectronShell = require('../ElectronShell/ElectronShell.js')
const ElectronWindowOpenActionType = require('../ElectronWindowOpenActionType/ElectronWindowOpenActionType.js')
const LifeCycle = require('../LifeCycle/LifeCycle.js')
const Platform = require('../Platform/Platform.js')
const Preferences = require('../Preferences/Preferences.js')

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
  const parsedArgs = Cli.parseCliArgs(additionalData)
  Debug.debug('[info] second instance args', additionalData, parsedArgs)
  const handled = Cli.handleFastCliArgsMaybe(parsedArgs) // TODO don't like the side effect here
  if (handled) {
    return
  }
  await this.handleReady(parsedArgs, workingDirectory)
}

const handleWebContentsNavigate = (event) => {
  event.preventDefault()
}

const handleWebContentsWindowOpen = ({ url }) => {
  ElectronShell.openExternal(url)
  return {
    action: ElectronWindowOpenActionType.Deny,
  }
}

exports.handleWebContentsCreated = (event, webContents) => {
  webContents.on('will-navigate', handleWebContentsNavigate)
  webContents.setWindowOpenHandler(handleWebContentsWindowOpen)
}
