import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import * as IpcState from '../IpcState/IpcState.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.js'

export const send = (method, ...params) => {
  const ipc = IpcState.get()
  JsonRpc.send(ipc, method, ...params)
}

const handleMessageFromRendererWorker = async (event) => {
  const message = event.data
  const ipc = IpcState.get()
  if ('id' in message) {
    if ('method' in message) {
      const response = await GetResponse.getResponse(message, Command.execute)
      try {
        ipc.send(response)
      } catch (error) {
        await ErrorHandling.logError(error)
        const errorResponse = GetErrorResponse.getErrorResponse(message, error)
        ipc.send(errorResponse)
      }
      return
    }
    Callback.resolve(message.id, message)
    return
  }
  throw new JsonRpcError('unexpected message from renderer worker')
}

export const invoke = (method, ...params) => {
  const ipc = IpcState.get()
  return JsonRpc.invoke(ipc, method, ...params)
}

export const listen = (ipc) => {
  ipc.onmessage = handleMessageFromRendererWorker
  IpcState.set(ipc)
}
