import * as CreateWebViewServer from '../CreateWebViewServer/CreateWebViewServer.js'

const state = {
  /**
   * @type {any }
   */
  promise: undefined,
}

export const start = async (port, frameAncestors) => {
  if (!state.promise) {
    state.promise = CreateWebViewServer.createWebViewServer(port, frameAncestors)
  }
  return state.promise
}
