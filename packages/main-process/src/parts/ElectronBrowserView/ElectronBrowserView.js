const { BrowserView, BrowserWindow, ipcMain } = require('electron')
const ElectronSessionForBrowserView = require('../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js')
const ElectronSession = require('../ElectronSession/ElectronSession.js')
const Platform = require('../Platform/Platform.js')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const Root = require('../Root/Root.js')
const Path = require('../Path/Path.js')

exports.createBrowserView = async (url, top, left, width, height) => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  // TODO support multiple browser views in the future
  if (browserWindow.getBrowserViews().length > 0) {
    return
  }
  const view = new BrowserView({
    webPreferences: {
      session: ElectronSessionForBrowserView.getSession(),
    },
  })
  view.webContents.setWindowOpenHandler(
    ElectronSessionForBrowserView.handleWindowOpen
  )
  browserWindow.addBrowserView(view)
  view.setBounds({ x: left, y: top, width, height })
  await view.webContents.loadURL(url)

  // workaround for https://github.com/electron/electron/issues/15899
  // const topView = new BrowserView({
  //   webPreferences: {
  //     session: ElectronSession.get(),
  //     preload: Platform.getPreloadUrl(),
  //   },
  // })
  // topView.setAutoResize({
  //   width: true,
  //   height: true,
  //   horizontal: true,
  //   vertical: true,
  // })
  // topView.webContents.openDevTools()
  // const defaultUrl = `${Platform.scheme}://-`
  // topView.setBounds({ x: 0, y: 0, width: windowWidth, height: windowHeight })
  // AppWindowStates.add({
  //   window: topView,
  //   parsedArgs: [],
  //   workingDirectory: '',
  //   id: topView.webContents.id,
  // })
  // await topView.webContents.loadURL(defaultUrl)
  // browserWindow.addBrowserView(topView)
  // console.log('loaded top view')

  // browserWindow.setTopBrowserView(view)
}

exports.resizeBrowserView = (top, left, width, height) => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const views = browserWindow.getBrowserViews()
  const view = views[0]
  if (!view) {
    return
  }
  view.setBounds({ x: left, y: top, width, height })
}

exports.disposeBrowserView = (id) => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const views = browserWindow.getBrowserViews()
  const view = views[0]
  if (!view) {
    return
  }
  browserWindow.removeBrowserView(view)
}

exports.openDevtools = () => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const views = browserWindow.getBrowserViews()
  const view = views[0]
  if (!view) {
    return
  }
  view.webContents.openDevTools()
}

const handleMessage = () => {}

exports.createBrowserViewQuickPick = async (top, left, width, height) => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const preloadUrl = Path.join(
    Root.root,
    'packages',
    'main-process',
    'pages',
    'quickpick',
    'preload.js'
  )
  const view = new BrowserView({
    webPreferences: {
      session: ElectronSession.get(),
      preload: preloadUrl,
    },
  })
  browserWindow.addBrowserView(view)
  console.log({ top, left, width, height })
  view.setBounds({ x: left, y: top, width, height })
  const quickPickUrl = `${Platform.scheme}://-/packages/main-process/pages/quickpick/quickpick.html`
  const handleNavigate = () => {
    browserWindow.removeBrowserView(view)
    view.webContents.closeDevTools()
  }
  browserWindow.webContents.on('did-finish-load', handleNavigate)
  await view.webContents.loadURL(quickPickUrl)

  view.webContents.openDevTools({
    mode: 'detach',
  })

  const browserWindowState = AppWindowStates.findById(browserWindow.id)
  const port = browserWindowState.port
  const handleMessage = (event, value) => {
    console.log('handle message', value)
    port.postMessage(value)
  }
  ipcMain.on('QuickPick.handleMessage', handleMessage)
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

const getQuickPickView = () => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const views = browserWindow.getBrowserViews()
  const quickPickView = getQuickPickViewFromArray(views)
  return quickPickView
}

exports.setQuickPickItems = async (items) => {
  const quickPickView = getQuickPickView()
  if (!quickPickView) {
    return
  }
  const itemsString = JSON.stringify(items, null, 2)
  const javascript = `globalThis['QuickPick.setItems'](${itemsString})`
  await quickPickView.webContents.executeJavaScript(javascript)
}

exports.setQuickPickValue = async (value) => {
  const quickPickView = getQuickPickView()
  if (!quickPickView) {
    return
  }
  const valueString = JSON.stringify(value)
  const javascript = `globalThis['QuickPick.setValue'](${valueString})`
  await quickPickView.webContents.executeJavaScript(javascript)
}
