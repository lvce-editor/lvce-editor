import * as GetWebViewVirtualDom from '../GetWebViewVirtualDom/GetWebViewVirtualDom.ts'
import type { ViewletWebViewState } from './ViewletWebViewState.ts'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

// const renderWebView = {
//   isEqual(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
//     return oldState.iframeSrc === newState.iframeSrc && oldState.srcDoc === newState.srcDoc && oldState.csp === newState.csp
//   },
//   apply(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
//     const dom = GetWebViewVirtualDom.getWebViewVirtualDom()
//     return ['Viewlet.setDom2', dom]
//   },
// }

// const renderIframe = {
//   isEqual(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
//     return (
//       oldState.iframeSrc === newState.iframeSrc &&
//       oldState.sandbox === newState.sandbox &&
//       oldState.srcDoc === newState.srcDoc &&
//       oldState.csp === newState.csp &&
//       oldState.credentialless === newState.credentialless
//     )
//   },
//   apply(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
//     // TODO support CSP also in web
//     return ['setIframe', newState.iframeSrc, newState.sandbox, newState.srcDoc, newState.csp]
//   },
// }

// const renderPort = {
//   isEqual(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
//     return oldState.portId === newState.portId && oldState.origin === newState.origin
//   },
//   apply(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
//     return ['setPort', newState.portId, newState.origin]
//   },
// }

const renderIframe = {
  isEqual(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
    return false
  },
  apply(oldState: ViewletWebViewState, newState: ViewletWebViewState) {
    return ['setPosition', newState.id, newState.x, newState.y, newState.width, newState.height]
  },
}

export const render = [
  renderIframe,
  // renderWebView, renderIframe,
  // renderPort,
]
