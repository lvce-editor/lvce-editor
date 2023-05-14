/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as TerminalProcessIpc from '../TerminalProcessIpc/TerminalProcessIpc.js'
import { VError } from '../VError/VError.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
  /**
   * @type {any}
   */
  ipcPromise: undefined,
}

export const handleMessageFromTerminalProcess = async (message) => {
  if (message.method) {
    const result = await Command.execute(message.method, ...message.params)
    if (message.id) {
      state.send({
        jsonrpc: JsonRpcVersion.Two,
        id: message.id,
        result,
      })
    }
  } else {
    Callback.resolve(message.id, message)
  }
}

const actuallyListen = async () => {
  try {
    const ipc = await TerminalProcessIpc.listen(IpcParentType.Node)
    ipc.onmessage = handleMessageFromTerminalProcess
    state.ipc = ipc
  } catch (error) {
    throw new VError(error, `Failed to create terminal connection`)
  }
}

export const listen = async () => {
  if (!state.ipcPromise) {
    state.ipcPromise = actuallyListen()
  }
  return state.ipcPromise
}

export const invoke = (method, ...params) => {
  return JsonRpc.invoke(state.ipc, method, ...params)
}
