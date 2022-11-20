const { spawn } = require('child_process')
const { app } = require('electron')
const unhandled = require('electron-unhandled') // TODO this might slow down initial startup
const Electron = require('electron')
const Platform = require('../Platform/Platform.js')
const Debug = require('../Debug/Debug.js')
const LifeCycle = require('../LifeCycle/LifeCycle.js')
const Performance = require('../Performance/Performance.js')
const Cli = require('../Cli/Cli.js')
const AppWindow = require('../AppWindow/AppWindow.js')
const HandleMessagePort = require('../HandleMessagePort/HandleMessagePort.js')

// TODO use Platform.getScheme() instead of Product.getTheme()

// const handleAppReady = async () => {

// }

const handleWindowAllClosed = () => {
  Debug.debug('[info] all windows closed')
  if (!Platform.isMacOs) {
    Debug.debug('[info] quitting')
    Electron.app.quit()
  }
}

const handleBeforeQuit = () => {
  LifeCycle.setShutDown()
  Debug.debug('[info] before quit')
}

// TODO maybe handle critical (first render) request via ipcMain
// and spawn shared process when page is idle/loaded
// currently launching shared process takes 170ms
// which means first paint is delayed by a lot

// map windows to folders and ports
// const windowConfigMap = new Map()

const handleReady = async (parsedArgs, workingDirectory) => {
  await AppWindow.createAppWindow(parsedArgs, workingDirectory)
}

const handleSecondInstance = async (
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
  await handleReady(parsedArgs, workingDirectory)
}

exports.hydrate = async () => {
  unhandled({
    showDialog: true,
  })

  // TODO electron error ERROR:sandbox_linux.cc(364)] InitializeSandbox() called with multiple threads in process gpu-process

  // TODO electron error [90611:0219/003126.546542:ERROR:gl_surface_presentation_helper.cc(260)] GetVSyncParametersIfAvailable() failed for 1 times!
  // need to wait for solution https://github.com/electron/electron/issues/32760

  // TODO need to wait for playwright bugs to be resolved
  // before being able to test multi-window behavior
  // see https://github.com/microsoft/playwright/issues/12345
  const argv = process.argv

  const parsedCliArgs = Cli.parseCliArgs(argv)
  const handled = Cli.handleFastCliArgsMaybe(parsedCliArgs) // TODO don't like the side effect here
  if (handled) {
    return
  }

  const hasLock = Electron.app.requestSingleInstanceLock(argv)
  if (!hasLock) {
    Debug.debug('[info] quitting because no lock')
    Electron.app.quit()
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
    Electron.app.enableSandbox()
  } else {
    // see https://github.com/microsoft/vscode/issues/151187#issuecomment-1221475319
    if (Platform.isLinux) {
      app.commandLine.appendSwitch('--disable-gpu-sandbox')
    }
  }

  // protocol
  Electron.protocol.registerSchemesAsPrivileged([
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
  Electron.ipcMain.on('port', HandleMessagePort.handlePort)

  // app
  Electron.app.on('window-all-closed', handleWindowAllClosed)
  Electron.app.on('before-quit', handleBeforeQuit)
  // Electron.app.on('ready', handleAppReady)
  Electron.app.on('second-instance', handleSecondInstance)
  await Electron.app.whenReady()
  Performance.mark('code/appReady')

  await handleReady(parsedCliArgs, process.cwd())
  Debug.debug('[info] app window created')
}

exports.exit = () => {
  app.quit()
}
