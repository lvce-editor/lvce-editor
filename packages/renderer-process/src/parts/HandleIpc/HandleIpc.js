import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import * as HasTransferableResult from '../HasTransferableResult/HasTransferableResult.js'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.js'

export const handleIpc = (ipc) => {
  Assert.object(ipc)
  const handleMessage = async (event) => {
    const message = event.data
    if ('id' in message) {
      if ('method' in message) {
        const response = await GetResponse.getResponse(message, Command.execute)
        if (HasTransferableResult.hasTransferrableResult(message.method) && 'result' in response) {
          ipc.sendAndTransfer(response, [response.result])
        } else {
          ipc.send(response)
        }
        return
      }
      Callback.resolve(message.id, message)
      return
    }
    throw new JsonRpcError('unexpected message from renderer worker')
  }
  ipc.onmessage = handleMessage
}
