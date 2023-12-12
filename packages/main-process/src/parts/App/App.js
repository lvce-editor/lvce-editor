import * as Electron from 'electron'
import { spawn } from 'node:child_process'
import * as Cli from '../Cli/Cli.js'
import * as CommandLineSwitches from '../CommandLineSwitches/CommandLineSwitches.js'
import * as Debug from '../Debug/Debug.js'
import * as ElectronApp from '../ElectronApp/ElectronApp.js'
import * as ElectronAppEventType from '../ElectronAppEventType/ElectronAppEventType.js'
import * as ElectronAppListeners from '../ElectronAppListeners/ElectronAppListeners.js'
import * as ElectronIpcMain from '../ElectronIpcMain/ElectronIpcMain.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Exit from '../Exit/Exit.js'
import * as HandleElectronReady from '../HandleElectronReady/HandleElectronReady.js'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.js'
import * as ParseCliArgs from '../ParseCliArgs/ParseCliArgs.js'
import * as Performance from '../Performance/Performance.js'
import * as PerformanceMarkerType from '../PerformanceMarkerType/PerformanceMarkerType.js'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'
import * as Protocol from '../Protocol/Protocol.js'
// TODO use Platform.getScheme() instead of Product.getTheme()

// const handleAppReady = async () => {

// }

// TODO maybe handle critical (first render) request via ipcMain
// and spawn shared process when page is idle/loaded
// currently launching shared process takes 170ms
// which means first paint is delayed by a lot

// map windows to folders and ports
// const windowConfigMap = new Map()

export const hydrate = async () => {
  Electron.Menu.setApplicationMenu(null) // performance
  const { default: unhandled } = await import('electron-unhandled') // TODO this might slow down initial startup
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
    Exit.exit()
    return
  }

  // TODO tree shake out the .env.DEV check: reading from env variables is expensive
  if (process.stdout.isTTY && !parsedCliArgs.wait && !process.env.DEV) {
    spawn(Process.execPath, argv.slice(1), {
      // env: { ...process.env },
      detached: true,
      stdio: 'ignore',
    })
    Process.exit(ExitCode.Success)
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

  await HandleElectronReady.handleReady(parsedCliArgs, Process.cwd())
  Debug.debug('[info] app window created')
}
