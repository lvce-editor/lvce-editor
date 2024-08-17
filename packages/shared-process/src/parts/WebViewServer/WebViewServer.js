import * as CreateWebViewServer from '../CreateWebViewServer/CreateWebViewServer.js'

const state = {
  /**
   * @type {any }
   */
  promise: undefined,
}

export const start = async (port, frameAncestors, webViewRoot) => {
  if (!state.promise) {
    state.promise = CreateWebViewServer.createWebViewServer(port, frameAncestors, webViewRoot)
  }
  return state.promise
}
