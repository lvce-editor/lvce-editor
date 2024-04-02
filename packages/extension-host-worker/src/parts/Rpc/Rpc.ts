import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
import * as IpcState from '../IpcState/IpcState.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const send = (method, ...params) => {
  const ipc = IpcState.get()
  JsonRpc.send(ipc, method, ...params)
}

const preparePrettyError = () => {}

const logError = () => {}

const requiresSocket = () => {}

const handleMessageFromRendererWorker = (event) => {
  const message = event.data
  const ipc = IpcState.get()
  return JsonRpc.handleJsonRpcMessage(ipc, message, Command.execute, Callback.resolve, preparePrettyError, logError, requiresSocket)
}

export const invoke = (method, ...params) => {
  const ipc = IpcState.get()
  return JsonRpc.invoke(ipc, method, ...params)
}

export const listen = (ipc) => {
  ipc.onmessage = handleMessageFromRendererWorker
  IpcState.set(ipc)
}
