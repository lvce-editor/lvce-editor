import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.js'

export const handleIpc = (ipc) => {
  const handleMessageFromRendererWorker = async (message) => {
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
  ipc.onmessage = handleMessageFromRendererWorker
}
