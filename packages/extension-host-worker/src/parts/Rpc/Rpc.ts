import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.ts'
import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.ts'
import * as GetResponse from '../GetResponse/GetResponse.ts'
import * as IpcState from '../IpcState/IpcState.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.ts'

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
        // @ts-ignore
        ipc.send(response)
      } catch (error) {
        await ErrorHandling.logError(error)
        const errorResponse = GetErrorResponse.getErrorResponse(message, error)
        // @ts-ignore
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
