import * as GetWebViewVirtualDom from '../GetWebViewVirtualDom/GetWebViewVirtualDom.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderWebView = {
  isEqual(oldState, newState) {
    return oldState.iframeSrc === newState.iframeSrc
  },
  apply(oldState, newState) {
    const dom = GetWebViewVirtualDom.getWebViewVirtualDom()
    return ['Viewlet.setDom2', dom]
  },
}

const renderIframe = {
  isEqual(oldState, newState) {
    return oldState.iframeSrc === newState.iframeSrc && oldState.sandbox === newState.sandbox
  },
  apply(oldState, newState) {
    // TODO support CSP
    return ['setIframe', newState.iframeSrc, newState.sandbox]
  },
}

const renderPort = {
  isEqual(oldState, newState) {
    return oldState.portId === newState.portId && oldState.origin === newState.origin
  },
  apply(oldState, newState) {
    return ['setPort', newState.portId, newState.origin]
  },
}

export const render = [renderWebView, renderIframe, renderPort]