/* istanbul ignore file */
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const state = {
  pendingMessages: [],
  /**
   * @type {any}
   */
  ipc: undefined,
}

const getIpc = () => {
  return IpcChild.listen({ method: IpcChildType.Auto() })
}

export const listen = async () => {
  console.assert(state.pendingMessages.length === 0)
  const ipc = await getIpc()
  HandleIpc.handleIpc(ipc, 'renderer process')
  state.ipc = ipc
}

/**
 * @deprecated use invoke instead
 * @param {*} message
 */
export const send = (message) => {
  state.ipc.send(message)
}

export const invoke = async (method, ...params) => {
  return JsonRpc.invoke(state.ipc, method, ...params)
}

export const sendAndTransfer = (message, transferables) => {
  state.ipc.sendAndTransfer(message, transferables)
}
