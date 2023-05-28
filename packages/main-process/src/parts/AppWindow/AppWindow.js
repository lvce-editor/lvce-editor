const VError = require('verror')
const Screen = require('../ElectronScreen/ElectronScreen.js')
const Window = require('../ElectronWindow/ElectronWindow.js')
const Performance = require('../Performance/Performance.js')
const LifeCycle = require('../LifeCycle/LifeCycle.js')
const Session = require('../ElectronSession/ElectronSession.js')
const Platform = require('../Platform/Platform.js')
const Preferences = require('../Preferences/Preferences.js')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const Logger = require('../Logger/Logger.js')
const ElectronApplicationMenu = require('../ElectronApplicationMenu/ElectronApplicationMenu.js')
const { WindowLoadError } = require('../WindowLoadError/WindowLoadError.js')
const PerformanceMarkerType = require('../PerformanceMarkerType/PerformanceMarkerType.js')

// TODO impossible to test these methods
// and ensure that there is no memory leak
/**
 * @param {import('electron').Event} event
 */
const handleWindowClose = (event) => {
  const browserWindow = event.sender
  AppWindowStates.remove(browserWindow.webContents.id)
}

const loadUrl = async (browserWindow, url) => {
  Performance.mark(PerformanceMarkerType.WillLoadUrl)
  try {
    await browserWindow.loadURL(url)
  } catch (error) {
    if (LifeCycle.isShutDown()) {
      Logger.info('error during shutdown', error)
    } else {
      throw new WindowLoadError(error, url)
    }
  }
  Performance.mark(PerformanceMarkerType.DidLoadUrl)
}

const defaultUrl = `${Platform.scheme}://-`

// TODO avoid mixing BrowserWindow, childprocess and various lifecycle methods in one file -> separate concerns
exports.createAppWindow = async (preferences, parsedArgs, workingDirectory, url = defaultUrl) => {
  const titleBarPreference = Preferences.get(preferences, 'window.titleBarStyle')
  const frame = titleBarPreference !== 'custom'
  const titleBarStyle = titleBarPreference === 'custom' ? 'hidden' : undefined
  const zoomLevelPreference = Preferences.get(preferences, 'window.zoomLevel')
  const zoomLevel = zoomLevelPreference
  const windowControlsOverlayPreference = Platform.isWindows && Preferences.get(preferences, 'window.controlsOverlay.enabled')
  const titleBarOverlay = windowControlsOverlayPreference
    ? {
        color: '#1e2324',
        symbolColor: '#74b1be',
        height: 29,
      }
    : undefined
  const session = Session.get()
  const window = Window.create({
    y: 0,
    x: Screen.getWidth() - 800,
    width: 800,
    height: Screen.getHeight(),
    menu: true,
    background: '#1e2324',
    session,
    titleBarStyle,
    frame,
    zoomLevel,
    titleBarOverlay,
  })
  const menu = ElectronApplicationMenu.createTitleBar()
  ElectronApplicationMenu.setMenu(menu)

  // window.setMenu(menu)
  window.setMenuBarVisibility(true)
  window.setAutoHideMenuBar(false)
  window.on('close', handleWindowClose)
  AppWindowStates.add({
    parsedArgs,
    workingDirectory,
    id: window.webContents.id,
  })
  window.webContents.openDevTools()
  await loadUrl(window, url)
}

exports.openNew = async (url) => {
  const preferences = await Preferences.load()
  return exports.createAppWindow(preferences, [], '', url)
}

exports.findById = (id) => {
  return AppWindowStates.findById(id)
}
