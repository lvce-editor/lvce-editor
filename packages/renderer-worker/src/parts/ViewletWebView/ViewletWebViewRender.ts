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

export const render = [renderWebView]
