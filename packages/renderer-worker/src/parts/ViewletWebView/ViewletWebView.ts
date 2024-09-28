import * as GetWebViewPort from '../GetWebViewPort/GetWebViewPort.ts'
import * as GetWebViews from '../GetWebViews/GetWebViews.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as WebView from '../WebView/WebView.ts'
import type { ViewletWebViewState } from './ViewletWebViewState.ts'

export const create = (id: number, uri: string, x: number, y: number, width: number, height: number): ViewletWebViewState => {
  return {
    id,
    uri,
    iframeSrc: '',
    srcDoc: '',
    sandbox: [],
    portId: 0,
    origin: '',
    previewServerId: 1,
    csp: '',
    credentialless: true,
    x,
    y,
    width,
    height,
  }
}

const getWebViewId = async (uri) => {
  if (uri.startsWith('webview://')) {
    const webViewId = uri.slice('webview://'.length)
    return webViewId
  }
  const webViews = await GetWebViews.getWebViews()
  for (const webView of webViews) {
    for (const selector of webView.selector || []) {
      if (uri.endsWith(selector)) {
        return webView.id
      }
    }
  }
  return ''
}

export const loadContent = async (state: ViewletWebViewState): Promise<ViewletWebViewState> => {
  const { uri, previewServerId, id } = state
  const webViewId = await getWebViewId(uri)
  const webViewPort = GetWebViewPort.getWebViewPort()
  const webViewResult = await WebView.create(id, webViewPort, webViewId, previewServerId, uri)
  if (!webViewResult) {
    return state
  }
  const { iframeSrc, sandbox, portId, origin, srcDoc, csp } = webViewResult
  return {
    ...state,
    iframeSrc,
    sandbox,
    portId,
    origin,
    srcDoc,
    csp,
  }
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return {
    ...state,
    ...dimensions,
  }
}

export const dispose = async (state) => {
  await RendererProcess.invoke('WebView.dispose', state.uid)
  return state
}
