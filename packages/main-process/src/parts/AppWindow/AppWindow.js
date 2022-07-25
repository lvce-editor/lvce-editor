const VError = require('verror')
const Screen = require('../Screen/Screen.js')
const Window = require('../Window/Window.js')
const Performance = require('../Performance/Performance.js')
const LifeCycle = require('../LifeCycle/LifeCycle.js')
const Session = require('../Session/Session.js')
const Platform = require('../Platform/Platform.js')

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

const loadDefaultUrl = async (browserWindow) => {
  Performance.mark('code/willLoadUrl')
  try {
    await browserWindow.loadURL(`${Platform.getScheme()}://-`)
  } catch (error) {
    if (LifeCycle.isShutDown()) {
      console.info('error during shutdown', error)
    } else {
      throw new VError(
        // @ts-ignore
        error,
        `Failed to load window url (phase ${LifeCycle.getPhase()})`
      )
    }
  }
  Performance.mark('code/didLoadUrl')
}

// TODO avoid mixing BrowserWindow, childprocess and various lifecycle methods in one file -> separate concerns
exports.createAppWindow = async (parsedArgs, workingDirectory) => {
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
  await loadDefaultUrl(window)
}

exports.findById = (id) => {
  for (const window of this.state.windows) {
    if (window.id === id) {
      return window
    }
  }
  return undefined
}
