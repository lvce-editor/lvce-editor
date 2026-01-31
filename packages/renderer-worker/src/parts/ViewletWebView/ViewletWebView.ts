import * as IframeWorker from '../IframeWorker/IframeWorker.js'
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
    x: x - 1,
    y,
    width,
    height,
    commands: [],
  }
}

export const loadContent = async (state: ViewletWebViewState): Promise<ViewletWebViewState> => {
  const savedState = {}
  await IframeWorker.invoke('WebView.create4', state.id, '', state.x, state.y, state.width, state.height, null)
  await IframeWorker.invoke('WebView.loadContent', state.id, savedState)
  const diffResult = await IframeWorker.invoke('WebView.diff2', state.id)
  const commands = await IframeWorker.invoke('WebView.render2', state.id, diffResult)
  console.log({ commands })
  return {
    ...state,
    commands,
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
  return state
}
