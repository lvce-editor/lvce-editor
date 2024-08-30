import * as WebView from '../WebView/WebView.ts'
import * as GetWebViewPort from '../GetWebViewPort/GetWebViewPort.ts'

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

const getWebViewId = (uri) => {
  if (uri.startsWith('webview://')) {
    const webViewId = uri.slice('webview://'.length)
    return webViewId
  }
  if (uri.endsWith('.heapsnapshot')) {
    return 'builtin.heap-snapshot-viewer'
  }
  return ''
}

export const loadContent = async (state) => {
  const { uri, previewServerId } = state
  const webViewId = getWebViewId(uri)
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
