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
  if (Platform.platform === PlatformType.Remote) {
    // TODO apply something similar for electron
    // TODO make port configurable
    // TODO pass webview root, so that only these resources can be accessed
    // TODO pass csp configuration to server
    // TODO pass coop / coep configuration to server
    const port = 3002
    await SharedProcess.invoke('WebViewServer.start', port)
  }
  const webViews = await GetWebViews.getWebViews()
  const iframeSrc = getIframeSrc(webViews, webViewId)
  const sandbox = GetWebViewSandBox.getIframeSandbox()
  return {
    ...state,
    iframeSrc,
    sandbox,
  }
}
