const { BrowserView, BrowserWindow } = require('electron')
const { VError } = require('verror')
const DisposeWebContents = require('../DisposeWebContents/DisposeWebContents.js')
const ElectronSession = require('../ElectronSession/ElectronSession.js')
const Logger = require('../Logger/Logger.js')
const Path = require('../Path/Path.js')
const PendingPorts = require('../PendingPorts/PendingPorts.js')
const Platform = require('../Platform/Platform.js')
const Root = require('../Root/Root.js')
const ElectronWebContentsEventType = require('../ElectronWebContentsEventType/ElectronWebContentsEventType.js')

const state = (exports.state = {
  /**
   * @type {any}
   */
  browserView: undefined,
  port: undefined,
})

exports.disposeBrowserView = () => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  if (!state.browserView) {
    return
  }
  DisposeWebContents.disposeWebContents(state.browserView)
  browserWindow.removeBrowserView(state.browserView)
  state.browserView = undefined
  state.port = undefined
}

exports.createBrowserView = async (x, y, width, height, openDevtools = false) => {
  try {
    if (state.browserView) {
      throw new Error('browser view already exists')
    }
    const browserWindow = BrowserWindow.getFocusedWindow()
    if (!browserWindow) {
      return
    }
    const preloadUrl = Path.join(Root.root, 'packages', 'main-process', 'pages', 'suggestions', 'preload.js')
    const view = new BrowserView({
      webPreferences: {
        session: ElectronSession.get(),
        preload: preloadUrl,
      },
    })
    state.browserView = view
    browserWindow.addBrowserView(view)
    view.setBounds({ x, y, width, height })
    const url = `${Platform.scheme}://-/packages/main-process/pages/suggestions/suggestions.html`
    const handleNavigate = () => {
      view.webContents.closeDevTools()
      browserWindow.removeBrowserView(view)
    }
    browserWindow.webContents.on(ElectronWebContentsEventType.DidNavigate, handleNavigate)
    if (openDevtools) {
      view.webContents.openDevTools({ mode: 'detach' })
    }
    await view.webContents.loadURL(url)
    const pendingPort = PendingPorts.get('suggestions')
    if (pendingPort) {
      console.log('[main-process] send pending suggestions port')
      view.webContents.postMessage('port', '', [pendingPort])
      PendingPorts.delete('suggestions')
    }
  } catch (error) {
    Logger.error(error)
    // @ts-ignore
    throw new VError(error, `Failed to create suggestions browser view`)
  }
}

const getSuggestionsHtml = (suggestions) => {
  let html = '<ul>'
  for (const suggestion of suggestions) {
    html += '<li>'
    html += suggestion
    html += '</li>'
  }
  html += '</ul>'
  return html
}

exports.setSuggestions = async (suggestions) => {
  const browserView = state.browserView
  if (!browserView) {
    return
  }
  const port = state.port
  const webContents = browserView.webContents
  const suggestionsHtml = getSuggestionsHtml(suggestions)
  const execString = `document.body.innerHTML = \`${suggestionsHtml}\``
  try {
    await webContents.executeJavaScript(execString)
  } catch (error) {
    console.log({ error })
  }
  console.log({ suggestions })
}
