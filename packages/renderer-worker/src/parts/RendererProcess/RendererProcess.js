import { WebWorkerRpcClient2 } from '../../../../../static/js/lvce-editor-rpc.js'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.js'

export const state = {
  pendingMessages: [],
  /**
   * @type {any}
   */
  rpc: undefined,
}

const getRpc = async () => {
  // TODO replace this with a static commandmap

  const rpc = await WebWorkerRpcClient2.create({
    commandMap: CommandMapRef.commandMapRef,
  })
  return rpc
}

export const listen = async () => {
  console.assert(state.pendingMessages.length === 0)
  const rpc = await getRpc()
  state.rpc = rpc
}

/**
 * @deprecated use invoke instead
 * @param {*} message
 */
export const send = (message) => {
  state.rpc.send(message)
}

export const invoke = (method, ...params) => {
  return state.rpc.invoke(method, ...params)
}

export const invokeAndTransfer = (method, ...params) => {
  return state.rpc.invokeAndTransfer(method, ...params)
}

export const sendAndTransfer = (message, transferables) => {
  state.rpc.ipc.sendAndTransfer(message, transferables)
}
