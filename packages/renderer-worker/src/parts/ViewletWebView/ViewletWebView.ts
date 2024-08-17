import * as GetWebViews from '../GetWebViews/GetWebViews.ts'
import * as GetWebViewSandBox from '../GetWebViewSandBox/GetWebViewSandBox.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const create = (id, uri) => {
  return {
    id,
    uri,
    iframeSrc: '',
    sandbox: [],
  }
}

const getIframeSrc = (webViews, webViewId) => {
  for (const webView of webViews) {
    if (webView.id === webViewId) {
      return webView.path
    }
  }
  return ''
}

export const loadContent = async (state) => {
  const { uri } = state
  const webViewId = uri.slice('webview://'.length)
  // TODO make port configurable
  const webViewPort = 3002
  if (Platform.platform === PlatformType.Remote) {
    // TODO apply something similar for electron
    // TODO pass webview root, so that only these resources can be accessed
    // TODO pass csp configuration to server
    // TODO pass coop / coep configuration to server
    await SharedProcess.invoke('WebViewServer.start', webViewPort)
  }
  const webViews = await GetWebViews.getWebViews()
  const iframeSrc = getIframeSrc(webViews, webViewId)
  let actualIframeSrc = iframeSrc
  if (Platform.platform === PlatformType.Remote) {
    actualIframeSrc = iframeSrc.replace('http://localhost:3000', `http://localhost:${webViewPort}`)
  }
  const sandbox = GetWebViewSandBox.getIframeSandbox()
  return {
    ...state,
    iframeSrc: actualIframeSrc,
    sandbox,
  }
}
