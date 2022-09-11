const VError = require('verror')
const Screen = require('../ElectronScreen/ElectronScreen.js')
const Window = require('../ElectronWindow/ElectronWindow.js')
const Performance = require('../Performance/Performance.js')
const LifeCycle = require('../LifeCycle/LifeCycle.js')
const Session = require('../ElectronSession/ElectronSession.js')
const Platform = require('../Platform/Platform.js')
const Assert = require('../Assert/Assert.js')

exports.state = {
  /**
   * @type {any[]}
   */
  windows: [],
}

// TODO impossible to test these methods
// and ensure that there is no memory leak
/**
 * @param {import('electron').Event} event
 */
const handleWindowClose = (event) => {
  const id = event.sender.id
  const index = exports.state.windows.findIndex((window) => window.id === id)
  if (index === -1) {
    throw new Error('expected window to be in windows array')
  }
  exports.state.windows.splice(index, 1)
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
  const session = Session.get()
  const window = Window.create({
    y: 0,
    x: Screen.getWidth() - 800,
    width: 800,
    height: Screen.getHeight(),
    menu: true,
    background: '#1e2324',
    session,
  })
  window.on('close', handleWindowClose)
  exports.state.windows.push({
    window,
    parsedArgs,
    workingDirectory,
    id: window.id,
  })
  await loadUrl(window, url)
}

exports.openNew = (url) => {
  // Assert.string(url)
  // console.log({ url })
  return exports.createAppWindow([], '', url)
}

exports.findById = (id) => {
  for (const window of this.state.windows) {
    if (window.id === id) {
      return window
    }
  }
  return undefined
}
