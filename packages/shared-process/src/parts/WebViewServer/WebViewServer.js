import * as CreateWebViewServer from '../CreateWebViewServer/CreateWebViewServer.js'

const state = {
  /**
   * @type {any }
   */
  promise: undefined,
}

export const start = async (port) => {
  if (!state.promise) {
    state.promise = CreateWebViewServer.createWebViewServer(port)
  }
  return state.promise
}
