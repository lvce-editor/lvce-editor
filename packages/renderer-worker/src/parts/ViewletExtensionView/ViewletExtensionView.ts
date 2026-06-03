import * as GetExtensionViews from '../GetExtensionViews/GetExtensionViews.ts'
import type { ViewletExtensionViewState } from './ViewletExtensionViewState.ts'

export const create = (id: number, uri: string, x: number, y: number, width: number, height: number): ViewletExtensionViewState => {
  return {
    csp: '',
    credentialless: true,
    height,
    iframeSandbox: [],
    iframeSrc: '',
    title: '',
    uid: id,
    uri,
    width,
    x,
    y,
  }
}

export const loadContent = async (state: ViewletExtensionViewState): Promise<ViewletExtensionViewState> => {
  const view = await GetExtensionViews.getExtensionView(state.uri)
  if (!view) {
    throw new Error(`view ${state.uri} not found`)
  }
  if (!view.iframe) {
    throw new Error(`view ${state.uri} is missing iframe contribution`)
  }
  return {
    ...state,
    csp: view.iframe.csp,
    credentialless: view.iframe.credentialless,
    iframeSandbox: view.iframe.sandbox,
    iframeSrc: view.iframe.src,
    title: view.title,
  }
}

export const hasFunctionalResize = true

export const resize = (state: ViewletExtensionViewState, dimensions: any): ViewletExtensionViewState => {
  return {
    ...state,
    ...dimensions,
  }
}
