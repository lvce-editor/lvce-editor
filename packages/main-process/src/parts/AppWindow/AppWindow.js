import * as AppWindowStates from '../AppWindowStates/AppWindowStates.js'
import * as DefaultUrl from '../DefaultUrl/DefaultUrl.js'
import * as Screen from '../ElectronScreen/ElectronScreen.js'
import * as Session from '../ElectronSession/ElectronSession.js'
import * as Window from '../ElectronWindow/ElectronWindow.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as Logger from '../Logger/Logger.js'
import * as Performance from '../Performance/Performance.js'
import * as PerformanceMarkerType from '../PerformanceMarkerType/PerformanceMarkerType.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import { VError } from '../VError/VError.js'
import { WindowLoadError } from '../WindowLoadError/WindowLoadError.js'

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
export const createAppWindow = async (preferences, parsedArgs, workingDirectory, url = DefaultUrl.defaultUrl) => {
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
  const ElectronApplicationMenu = await import('../ElectronApplicationMenu/ElectronApplicationMenu.js')
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

export const openNew = async (url) => {
  const preferences = await Preferences.load()
  return createAppWindow(preferences, [], '', url)
}

export const findById = (id) => {
  return AppWindowStates.findByWindowId(id)
}
