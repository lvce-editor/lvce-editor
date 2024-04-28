import * as Electron from 'electron'
import unhandled from 'electron-unhandled' // TODO this might slow down initial startup
import { spawn } from 'node:child_process'
import * as AppPaths from '../AppPaths/AppPaths.js'
import * as Argv from '../Argv/Argv.js'
import * as Cli from '../Cli/Cli.js'
import * as CommandLineSwitches from '../CommandLineSwitches/CommandLineSwitches.js'
import * as Debug from '../Debug/Debug.js'
import * as ElectronApp from '../ElectronApp/ElectronApp.js'
import * as ElectronAppEventType from '../ElectronAppEventType/ElectronAppEventType.js'
import * as ElectronAppListeners from '../ElectronAppListeners/ElectronAppListeners.js'
import * as ElectronApplicationMenu from '../ElectronApplicationMenu/ElectronApplicationMenu.js'
import * as Exit from '../Exit/Exit.js'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as HandleElectronReady from '../HandleElectronReady/HandleElectronReady.js'
import * as HandleSecondInstance from '../HandleSecondInstance/HandleSecondInstance.js'
import * as HandleWindowAllClosed from '../HandleWindowAllClosed/HandleWindowAllClosed.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as ParseCliArgs from '../ParseCliArgs/ParseCliArgs.js'
import * as Performance from '../Performance/Performance.js'
import * as PerformanceMarkerType from '../PerformanceMarkerType/PerformanceMarkerType.js'
import * as Platform from '../Platform/Platform.js'
import * as Process from '../Process/Process.js'
import * as Protocol from '../Protocol/Protocol.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SingleInstanceLock from '../SingleInstanceLock/SingleInstanceLock.js'

// TODO maybe handle critical (first render) request via ipcMain
// and spawn shared process when page is idle/loaded
// currently launching shared process takes 170ms
// which means first paint is delayed by a lot

export const hydrate = async () => {
  ElectronApplicationMenu.setMenu(null) // performance
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

  const parsedCliArgs = ParseCliArgs.parseCliArgs(Argv.argv)
  const handled = await Cli.handleFastCliArgsMaybe(parsedCliArgs) // TODO don't like the side effect here
  if (handled !== false) {
    return
  }
  if (Platform.isLinux && Platform.chromeUserDataPath) {
    AppPaths.setUserDataPath(Platform.chromeUserDataPath)
    AppPaths.setSessionDataPath(Platform.chromeUserDataPath)
    AppPaths.setCrashDumpsPath(Platform.chromeUserDataPath)
    AppPaths.setLogsPath(Platform.chromeUserDataPath)
  }

  const hasLock = SingleInstanceLock.requestSingleInstanceLock(Argv.argv)
  if (!hasLock) {
    Debug.debug('[info] quitting because no lock')
    Exit.exit()
    return
  }

  // TODO tree shake out the .env.DEV check: reading from env variables is expensive
  if (process.stdout.isTTY && !parsedCliArgs.wait && !process.env.DEV) {
    spawn(Process.execPath, Argv.argv.slice(1), {
      detached: true,
      stdio: 'ignore',
    })
    Process.exit(ExitCode.Success)
  }

  // command line switches
  CommandLineSwitches.enable(parsedCliArgs)

  // protocol
  Protocol.enable(Electron.protocol)

  // app
  ElectronApp.on(ElectronAppEventType.WindowAllClosed, HandleWindowAllClosed.handleWindowAllClosed)
  ElectronApp.on(ElectronAppEventType.BeforeQuit, ElectronAppListeners.handleBeforeQuit)
  ElectronApp.on(ElectronAppEventType.WebContentsCreated, ElectronAppListeners.handleWebContentsCreated)
  ElectronApp.on(ElectronAppEventType.SecondInstance, HandleSecondInstance.handleSecondInstance)
  await ElectronApp.whenReady()
  Performance.mark(PerformanceMarkerType.AppReady)

  // start shared process
  await SharedProcess.getOrCreate({
    method: IpcParentType.ElectronUtilityProcess,
  })

  await HandleElectronReady.handleReady(parsedCliArgs, Process.cwd())
  Debug.debug('[info] app window created')
}
