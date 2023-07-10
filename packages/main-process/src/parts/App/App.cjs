const { spawn } = require('node:child_process')
const Cli = require('../Cli/Cli.cjs')
const ParseCliArgs = require('../ParseCliArgs/ParseCliArgs.cjs')
const CommandLineSwitches = require('../CommandLineSwitches/CommandLineSwitches.cjs')
const Debug = require('../Debug/Debug.cjs')
const Electron = require('electron')
const ElectronApp = require('../ElectronApp/ElectronApp.cjs')
const ElectronAppEventType = require('../ElectronAppEventType/ElectronAppEventType.cjs')
const ElectronApplicationMenu = require('../ElectronApplicationMenu/ElectronApplicationMenu.cjs')
const ElectronAppListeners = require('../ElectronAppListeners/ElectronAppListeners.cjs')
const ElectronIpcMain = require('../ElectronIpcMain/ElectronIpcMain.cjs')
const ExitCode = require('../ExitCode/ExitCode.cjs')
const HandleMessagePort = require('../HandleMessagePort/HandleMessagePort.cjs')
const Performance = require('../Performance/Performance.cjs')
const PerformanceMarkerType = require('../PerformanceMarkerType/PerformanceMarkerType.cjs')
const Process = require('../Process/Process.cjs')
const Platform = require('../Platform/Platform.cjs')
const Protocol = require('../Protocol/Protocol.cjs')
const unhandled = require('electron-unhandled') // TODO this might slow down initial startup
// TODO use Platform.getScheme() instead of Product.getTheme()

// const handleAppReady = async () => {

// }

// TODO maybe handle critical (first render) request via ipcMain
// and spawn shared process when page is idle/loaded
// currently launching shared process takes 170ms
// which means first paint is delayed by a lot

// map windows to folders and ports
// const windowConfigMap = new Map()

exports.hydrate = async () => {
  ElectronApplicationMenu.setMenu(null)
  unhandled({
    showDialog: true,
    logger() {}, // already exists in mainProcessMain.js
  })

  // TODO electron error ERROR:sandbox_linux.cc(364)] InitializeSandbox() called with multiple threads in process gpu-process

  // TODO electron error [90611:0219/003126.546542:ERROR:gl_surface_presentation_helper.cc(260)] GetVSyncParametersIfAvailable() failed for 1 times!
  // need to wait for solution https://github.com/electron/electron/issues/32760

  // TODO need to wait for playwright bugs to be resolved
  // before being able to test multi-window behavior
  // see https://github.com/microsoft/playwright/issues/12345
  const { argv } = process

  const parsedCliArgs = ParseCliArgs.parseCliArgs(argv)
  const handled = Cli.handleFastCliArgsMaybe(parsedCliArgs) // TODO don't like the side effect here
  if (handled) {
    return
  }

  if (Platform.isLinux && Platform.chromeUserDataPath) {
    Electron.app.setPath('userData', Platform.chromeUserDataPath)
    Electron.app.setPath('sessionData', Platform.chromeUserDataPath)
    Electron.app.setPath('crashDumps', Platform.chromeUserDataPath)
    Electron.app.setPath('logs', Platform.chromeUserDataPath)
  }

  const hasLock = ElectronApp.requestSingleInstanceLock(argv)
  if (!hasLock) {
    Debug.debug('[info] quitting because no lock')
    ElectronApp.quit()
    return
  }

  // TODO tree shake out the .env.DEV check: reading from env variables is expensive
  if (process.stdout.isTTY && !parsedCliArgs.wait && !process.env.DEV) {
    spawn(Process.execPath, argv.slice(1), {
      // env: { ...process.env },
      detached: true,
      stdio: 'ignore',
    })
    Process.exit(ExitCode.Sucess)
  }

  // command line switches
  CommandLineSwitches.enable(parsedCliArgs)

  // protocol
  Protocol.enable(Electron.protocol)

  // ipcMain
  ElectronIpcMain.on('port', HandleMessagePort.handlePort)

  // app
  ElectronApp.on(ElectronAppEventType.WindowAllClosed, ElectronAppListeners.handleWindowAllClosed)
  ElectronApp.on(ElectronAppEventType.BeforeQuit, ElectronAppListeners.handleBeforeQuit)
  ElectronApp.on(ElectronAppEventType.WebContentsCreated, ElectronAppListeners.handleWebContentsCreated)
  // Electron.app.on('ready', handleAppReady)
  ElectronApp.on(ElectronAppEventType.SecondInstance, ElectronAppListeners.handleSecondInstance)
  await ElectronApp.whenReady()
  Performance.mark(PerformanceMarkerType.AppReady)

  await ElectronAppListeners.handleReady(parsedCliArgs, Process.cwd())
  Debug.debug('[info] app window created')
}

exports.exit = () => {
  ElectronApp.quit()
}
