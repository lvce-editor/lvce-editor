import * as WebView from '../WebView/WebView.ts'
import * as GetWebViewPort from '../GetWebViewPort/GetWebViewPort.ts'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'

export const create = (id, uri) => {
  return {
    id,
    uri,
    iframeSrc: '',
    sandbox: [],
    portId: 0,
    origin: '',
    previewServerId: 1,
  }
}

const getWebViewId = async (uri) => {
  if (uri.startsWith('webview://')) {
    const webViewId = uri.slice('webview://'.length)
    return webViewId
  }
  const webViews = await GetWebViews.getWebViews()
  for (const webView of webViews) {
    for (const selector of webView.selectors || []) {
      if (uri.endsWith(selector)) {
        return webView.id
      }
    }
  }
  return ''
}

export const loadContent = async (state) => {
  const { uri, previewServerId } = state
  const webViewId = await getWebViewId(uri)
  const webViewPort = GetWebViewPort.getWebViewPort()
  const webViewResult = await WebView.create(webViewPort, webViewId, previewServerId, uri)
  if (!webViewResult) {
    return state
  }
  const { iframeSrc, sandbox, portId, origin } = webViewResult
  return {
    ...state,
    iframeSrc,
    sandbox,
    portId,
    origin,
  }
}
