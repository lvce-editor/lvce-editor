import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const setIpc = (ipc) => {
  state.ipc = ipc
}

export const send = (method, ...params) => {
  state.ipc.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
  })
}
