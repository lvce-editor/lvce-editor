import * as GetRealUri from '../GetRealUri/GetRealUri.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as WebView from '../WebView/WebView.js'
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

export const loadContent = async (state: ViewletWebViewState): Promise<ViewletWebViewState> => {
  const { uri, id } = state
  // TODO always use real uri, which simplifies path handling for windows
  const realUri = await GetRealUri.getRealUri(uri)
  await WebView.create3(realUri, id)
  return {
    ...state,
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
