/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const state = {
  pendingMessages: [],
  /**
   * @type {any}
   */
  ipc: undefined,
}

const handleMessageFromRendererProcess = async (event) => {
  const message = event.data
  if (typeof message === 'string') {
    console.warn(`unexpected message from renderer process: ${message}`)
    return
  }
  if (message.id) {
    if ('method' in message) {
      try {
        const result = await Command.execute(message.method, ...message.params)
        state.ipc.send({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          result,
        })
        return
      } catch (error) {
        state.ipc.send({
          jsonrpc: JsonRpcVersion.Two,
          id: message.id,
          error,
        })
        return
      }
    }
    Callback.resolve(message.id, message)
    return
  }
  await Command.execute(message.method, ...message.params)
}

const getIpc = () => {
  return IpcChild.listen({ method: IpcChildType.Auto() })
}

export const listen = async () => {
  console.assert(state.pendingMessages.length === 0)
  const ipc = await getIpc()
  ipc.onmessage = handleMessageFromRendererProcess
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
  return JsonRpc.invoke(state.ipc, method, params)
}

export const sendAndTransfer = (message, transferables) => {
  state.ipc.sendAndTransfer(message, transferables)
}
