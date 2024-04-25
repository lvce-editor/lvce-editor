import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const send = (method, ...params) => {
  const { ipc } = state
  if (!ipc) {
    return
  }
  JsonRpc.send(ipc, method, ...params)
}
