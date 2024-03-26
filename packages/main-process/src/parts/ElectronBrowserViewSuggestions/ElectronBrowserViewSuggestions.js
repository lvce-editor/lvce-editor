import { BrowserView, BrowserWindow } from 'electron'
import * as DisposeWebContents from '../DisposeWebContents/DisposeWebContents.js'
import * as ElectronSession from '../ElectronSession/ElectronSession.js'
import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.js'
import * as Logger from '../Logger/Logger.js'
import * as Path from '../Path/Path.js'
import * as PendingPorts from '../PendingPorts/PendingPorts.js'
import * as Platform from '../Platform/Platform.js'
import * as Root from '../Root/Root.js'
import { VError } from '../VError/VError.js'

export const state = {
  /**
   * @type {any}
   */
  browserView: undefined,
  port: undefined,
}

export const disposeBrowserView = () => {
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

export const createBrowserView = async (x, y, width, height, openDevtools = false) => {
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
    view.setBounds({
      x,
      y,
      width,
      height,
    })
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
      PendingPorts._delete('suggestions')
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

export const setSuggestions = async (suggestions) => {
  const { browserView } = state
  if (!browserView) {
    return
  }
  const { port } = state
  const { webContents } = browserView
  const suggestionsHtml = getSuggestionsHtml(suggestions)
  const execString = `document.body.innerHTML = \`${suggestionsHtml}\``
  try {
    await webContents.executeJavaScript(execString)
  } catch (error) {
    console.log({ error })
  }
  console.log({ suggestions })
}
