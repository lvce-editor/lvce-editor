import { BrowserView, BrowserWindow } from 'electron'
import * as ElectronSession from '../ElectronSession/ElectronSession.js'
import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as PendingPorts from '../PendingPorts/PendingPorts.js'
import * as Platform from '../Platform/Platform.js'
import * as Root from '../Root/Root.js'
import { VError } from '../VError/VError.js'

export const disposeBrowserViewQuickPick = () => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const views = browserWindow.getBrowserViews()
  const quickPickView = getQuickPickViewFromArray(views)
  if (!quickPickView) {
    return
  }
  browserWindow.removeBrowserView(quickPickView)
}

export const createBrowserViewQuickPick = async (x, y, width, height) => {
  try {
    const browserWindow = BrowserWindow.getFocusedWindow()
    if (!browserWindow) {
      return
    }
    const preloadUrl = Path.join(Root.root, 'packages', 'main-process', 'pages', 'quickpick', 'preload.js')
    const view = new BrowserView({
      webPreferences: {
        session: ElectronSession.get(),
        preload: preloadUrl,
      },
    })
    browserWindow.addBrowserView(view)
    view.setBounds({
      x,
      y,
      width,
      height,
    })
    const quickPickUrl = `${Platform.scheme}://-/packages/main-process/pages/quickpick/quickpick.html`
    const handleNavigate = () => {
      view.webContents.closeDevTools()
      browserWindow.removeBrowserView(view)
    }
    browserWindow.webContents.on(ElectronWebContentsEventType.DidNavigate, handleNavigate)
    await view.webContents.loadURL(quickPickUrl)
    const pendingPort = PendingPorts.get('quickPick')
    if (pendingPort) {
      console.log('[main-process] send pending quickpick port')
      view.webContents.postMessage('port', '', [pendingPort])
      PendingPorts._delete('quickPick')
    }
    view.webContents.focus()

    // view.webContents.openDevTools({
    //   mode: 'detach',
    // })
  } catch (error) {
    Logger.error(error)
    // @ts-ignore
    throw new VError(error, `Failed to create quickpick browser view`)
  }
}

/**
 *
 * @param {*} views
 * @returns {Electron.BrowserView|undefined}
 */
const getQuickPickViewFromArray = (views) => {
  for (const view of views) {
    const url = view.webContents.getURL()
    if (url.endsWith('quickpick.html')) {
      return view
    }
  }
  return undefined
}
