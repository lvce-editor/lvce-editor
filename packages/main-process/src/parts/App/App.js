const { spawn } = require('node:child_process')
const unhandled = require('electron-unhandled') // TODO this might slow down initial startup
const Platform = require('../Platform/Platform.js')
const Debug = require('../Debug/Debug.js')
const Performance = require('../Performance/Performance.js')
const Cli = require('../Cli/Cli.js')
const HandleMessagePort = require('../HandleMessagePort/HandleMessagePort.js')
const ElectronApp = require('../ElectronApp/ElectronApp.js')
const ElectronProtocol = require('../ElectronProtocol/ElectronProtocol.js')
const ElectronIpcMain = require('../ElectronIpcMain/ElectronIpcMain.js')
const ElectronApplicationMenu = require('../ElectronApplicationMenu/ElectronApplicationMenu.js')
const ElectronAppListeners = require('../ElectronAppListeners/ElectronAppListeners.js')
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

  const parsedCliArgs = Cli.parseCliArgs(argv)
  const handled = Cli.handleFastCliArgsMaybe(parsedCliArgs) // TODO don't like the side effect here
  if (handled) {
    return
  }

  const hasLock = ElectronApp.requestSingleInstanceLock(argv)
  if (!hasLock) {
    Debug.debug('[info] quitting because no lock')
    ElectronApp.quit()
    return
  }

  // TODO tree shake out the .env.DEV check: reading from env variables is expensive
  if (process.stdout.isTTY && !parsedCliArgs.wait && !process.env.DEV) {
    spawn(process.execPath, argv.slice(1), {
      // env: { ...process.env },
      detached: true,
      stdio: 'ignore',
    })
    process.exit(0)
  }

  // command line switches
  if (parsedCliArgs.sandbox) {
    ElectronApp.enableSandbox()
  } else {
    // see https://github.com/microsoft/vscode/issues/151187#issuecomment-1221475319
    if (Platform.isLinux) {
      ElectronApp.appendCommandLineSwitch('--disable-gpu-sandbox')
    }
  }

  // protocol
  ElectronProtocol.registerSchemesAsPrivileged([
    {
      scheme: Platform.scheme,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        stream: true,
      },
    },
  ])

  // ipcMain
  ElectronIpcMain.on('port', HandleMessagePort.handlePort)

  // app
  ElectronApp.on('window-all-closed', ElectronAppListeners.handleWindowAllClosed)
  ElectronApp.on('before-quit', ElectronAppListeners.handleBeforeQuit)
  // Electron.app.on('ready', handleAppReady)
  ElectronApp.on('second-instance', ElectronAppListeners.handleSecondInstance)
  await ElectronApp.whenReady()
  Performance.mark('code/appReady')

  await ElectronAppListeners.handleReady(parsedCliArgs, process.cwd())
  Debug.debug('[info] app window created')
}

exports.exit = () => {
  ElectronApp.quit()
}
