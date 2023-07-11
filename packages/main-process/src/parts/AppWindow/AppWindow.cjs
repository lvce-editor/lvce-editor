const { VError } = require('../VError/VError.cjs')
const { WindowLoadError } = require('../WindowLoadError/WindowLoadError.cjs')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.cjs')
const DefaultUrl = require('../DefaultUrl/DefaultUrl.cjs')
const ElectronApplicationMenu = require('../ElectronApplicationMenu/ElectronApplicationMenu.cjs')
const ErrorHandling = require('../ErrorHandling/ErrorHandling.cjs')
const LifeCycle = require('../LifeCycle/LifeCycle.cjs')
const Logger = require('../Logger/Logger.cjs')
const Performance = require('../Performance/Performance.cjs')
const PerformanceMarkerType = require('../PerformanceMarkerType/PerformanceMarkerType.cjs')
const Platform = require('../Platform/Platform.cjs')
const Preferences = require('../Preferences/Preferences.cjs')
const Screen = require('../ElectronScreen/ElectronScreen.cjs')
const Session = require('../ElectronSession/ElectronSession.cjs')
const Window = require('../ElectronWindow/ElectronWindow.cjs')

// TODO impossible to test these methods
// and ensure that there is no memory leak

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

// TODO avoid mixing BrowserWindow, childprocess and various lifecycle methods in one file -> separate concerns
exports.createAppWindow = async (preferences, parsedArgs, workingDirectory, url = DefaultUrl.defaultUrl) => {
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
  const webContentsId = window.webContents.id
  const windowId = window.id
  const handleWindowClose = () => {
    try {
      window.off('close', handleWindowClose)
      AppWindowStates.remove(windowId)
    } catch (error) {
      ErrorHandling.handleError(new VError(error, `Failed to run window close listener`))
    }
  }
  window.on('close', handleWindowClose)
  AppWindowStates.add({
    parsedArgs,
    workingDirectory,
    webContentsId,
    windowId,
  })
  await loadUrl(window, url)
}

exports.openNew = async (url) => {
  const preferences = await Preferences.load()
  return exports.createAppWindow(preferences, [], '', url)
}

exports.findById = (id) => {
  return AppWindowStates.findByWindowId(id)
}
