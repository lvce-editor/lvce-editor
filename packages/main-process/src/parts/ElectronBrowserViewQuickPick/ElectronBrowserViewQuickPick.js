const { BrowserView, BrowserWindow } = require('electron')
const { VError } = require('verror')
const ElectronSession = require('../ElectronSession/ElectronSession.js')
const Platform = require('../Platform/Platform.js')
const Root = require('../Root/Root.js')
const Path = require('../Path/Path.js')
const PendingPorts = require('../PendingPorts/PendingPorts.js')
const Logger = require('../Logger/Logger.js')
const ElectronWebContentsEventType = require('../ElectronWebContentsEventType/ElectronWebContentsEventType.js')

exports.disposeBrowserViewQuickPick = () => {
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

exports.createBrowserViewQuickPick = async (x, y, width, height) => {
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
    view.setBounds({ x, y, width, height })
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
      PendingPorts.delete('quickPick')
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
