/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as Logger from '../Logger/Logger.js'
import * as SharedProcessIpc from '../SharedProcessIpc/SharedProcessIpc.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

export const handleMessageFromSharedProcess = async (message) => {
  if (message.method) {
    const result = await Command.execute(message.method, ...message.params)
    if (message.id) {
      SharedProcessState.state.ipc.send({
        jsonrpc: JsonRpcVersion.Two,
        id: message.id,
        result,
      })
    }
  } else if (message.id) {
    Callback.resolve(message.id, message)
  } else {
    Logger.warn('unexpected message from shared process', message)
  }
}

export const listen = async () => {
  const ipc = await SharedProcessIpc.listen(IpcParentType.Node)
  ipc.onmessage = handleMessageFromSharedProcess
  SharedProcessState.state.ipc = ipc
}

export const invoke = async (method, ...params) => {
  // if (platform === 'web') {
  //   console.warn('SharedProcess is not available on web')
  //   return
  // }
  const result = await JsonRpc.invoke(SharedProcessState.state.ipc, method, ...params)
  return result
}

export const dispose = () => {
  SharedProcessState.state.ipc.dispose()
}

// TODO when shared process crashes / connection is lost: reconnect or show notification
