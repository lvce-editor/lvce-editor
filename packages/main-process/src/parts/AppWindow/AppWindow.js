import * as AppWindowStates from '../AppWindowStates/AppWindowStates.js'
import * as DefaultUrl from '../DefaultUrl/DefaultUrl.js'
import * as Session from '../ElectronSession/ElectronSession.js'
import * as Window from '../ElectronWindow/ElectronWindow.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'
import * as Logger from '../Logger/Logger.js'
import * as Performance from '../Performance/Performance.js'
import * as PerformanceMarkerType from '../PerformanceMarkerType/PerformanceMarkerType.js'
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
export const createAppWindow2 = async (windowOptions, parsedArgs, workingDirectory, url = DefaultUrl.defaultUrl) => {
  const session = Session.get()
  const window = Window.create({
    ...windowOptions,
    session,
  })
  // TODO query applicarion menu items from shared process
  const ElectronApplicationMenu = await import('../ElectronApplicationMenu/ElectronApplicationMenu.js')
  const menu = ElectronApplicationMenu.createTitleBar()
  ElectronApplicationMenu.setMenu(menu)

  // window.setMenu(menu)
  window.setMenuBarVisibility(true)
  window.setAutoHideMenuBar(false)
  const webContentsId = window.webContents.id
  const windowId = window.id
  // TODO send event to shared process
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

export const findById = (id) => {
  return AppWindowStates.findByWindowId(id)
}
