/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as SharedProcessIpc from '../SharedProcessIpc/SharedProcessIpc.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const handleMessageFromSharedProcess = async (message) => {
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

export const listen = async () => {
  const ipc = await SharedProcessIpc.listen(IpcParentType.Node)
  ipc.onmessage = handleMessageFromSharedProcess
  state.ipc = ipc
}

export const invoke = async (method, ...params) => {
  // if (platform === 'web') {
  //   console.warn('SharedProcess is not available on web')
  //   return
  // }
  const result = await JsonRpc.invoke(state.ipc, method, ...params)
  return result
}

export const dispose = () => {
  state.dispose()
}

// TODO when shared process crashes / connection is lost: reconnect or show notification
