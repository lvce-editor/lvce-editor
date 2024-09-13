import * as GetWebViewVirtualDom from '../GetWebViewVirtualDom/GetWebViewVirtualDom.ts'
import type { ViewletWebViewState } from './ViewletWebViewState.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderWebView = {
  isEqual(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
    return oldState.iframeSrc === newState.iframeSrc
  },
  apply(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
    const dom = GetWebViewVirtualDom.getWebViewVirtualDom()
    return ['Viewlet.setDom2', dom]
  },
}

const renderIframe = {
  isEqual(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
    return oldState.iframeSrc === newState.iframeSrc && oldState.sandbox === newState.sandbox
  },
  apply(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
    // TODO support CSP
    return ['setIframe', newState.iframeSrc, newState.sandbox]
  },
}

const renderPort = {
  isEqual(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
    return oldState.portId === newState.portId && oldState.origin === newState.origin
  },
  apply(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
    return ['setPort', newState.portId, newState.origin]
  },
}

export const render = [renderWebView, renderIframe, renderPort]
