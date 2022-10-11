const VError = require('verror')
const Screen = require('../ElectronScreen/ElectronScreen.js')
const Window = require('../ElectronWindow/ElectronWindow.js')
const Performance = require('../Performance/Performance.js')
const LifeCycle = require('../LifeCycle/LifeCycle.js')
const Session = require('../ElectronSession/ElectronSession.js')
const Platform = require('../Platform/Platform.js')
const Preferences = require('../Preferences/Preferences.js')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')

// TODO impossible to test these methods
// and ensure that there is no memory leak
/**
 * @param {import('electron').Event} event
 */
const handleWindowClose = (event) => {
  const id = event.sender.id
  AppWindowStates.remove(id)
}

const loadUrl = async (browserWindow, url) => {
  Performance.mark('code/willLoadUrl')
  try {
    await browserWindow.loadURL(url)
  } catch (error) {
    if (LifeCycle.isShutDown()) {
      console.info('error during shutdown', error)
    } else {
      throw new VError(
        // @ts-ignore
        error,
        `Failed to load window url "${url}"`
      )
    }
  }
  Performance.mark('code/didLoadUrl')
}

const defaultUrl = `${Platform.scheme}://-`

// TODO avoid mixing BrowserWindow, childprocess and various lifecycle methods in one file -> separate concerns
exports.createAppWindow = async (
  parsedArgs,
  workingDirectory,
  url = defaultUrl
) => {
  const preferences = await Preferences.load()
  const titleBarPreference = Preferences.get(
    preferences,
    'window.titleBarStyle'
  )
  const frame = titleBarPreference === 'custom' ? false : true
  const titleBarStyle = titleBarPreference === 'custom' ? 'hidden' : undefined
  const zoomLevelPreference = Preferences.get(preferences, 'window.zoomLevel')
  const zoomLevel = zoomLevelPreference
  const windowControlsOverlayPreference =
    Platform.isWindows &&
    Preferences.get(preferences, 'window.controlsOverlay.enabled')
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
  window.on('close', handleWindowClose)
  AppWindowStates.add({
    window,
    parsedArgs,
    workingDirectory,
    id: window.id,
  })
  await loadUrl(window, url)

  // const view = new Electron.BrowserView()
  // window.setBrowserView(view)
  // view.setBounds({ x: 0, y: 0, width: 300, height: 300 })
  // await view.webContents.loadURL('https://electronjs.org')

  // setTimeout(() => {
  //   window.removeBrowserView(view)
  // }, 7000)
}

exports.openNew = (url) => {
  return exports.createAppWindow([], '', url)
}

exports.findById = (id) => {
  return AppWindowStates.findById(id)
}
