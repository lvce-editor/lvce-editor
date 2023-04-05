import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as HasTransferableResult from '../HasTransferableResult/HasTransferableResult.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.js'
import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.js'

const isResultMessage = (message) => {
  return 'result' in message
}

const isErrorMessage = (message) => {
  return 'error' in message
}

const handleMessageMethod = async (message, event) => {
  if ('id' in message) {
    if ('method' in message) {
      const response = await GetResponse.getResponse(message, Command.execute)
      if (HasTransferableResult.hasTransferrableResult(message.method) && 'result' in response) {
        try {
          event.target.send(response, [response.result])
        } catch (error) {
          const response = GetErrorResponse.getErrorResponse(message, error)
          event.target.send(response)
        }
      } else {
        event.target.send(response)
      }
      return
    }
    Callback.resolve(message.id, message)
    return
  }
  throw new JsonRpcError('unexpected message from extension host')
}

const handleMessage = async (message, event) => {
  if (message.id) {
    if (isResultMessage(message) || isErrorMessage(message)) {
      Callback.resolve(message.id, message)
    } else if ('method' in message) {
      handleMessageMethod(message, event)
    } else {
      throw new JsonRpcError('unexpected message type')
    }
  } else if (message.method) {
    await GlobalEventBus.emitEvent(message.method, ...message.params)
  } else {
    throw new JsonRpcError('unexpected message type')
  }
}

export const listen = (ipc) => {
  // TODO maybe pass handleMessage as parameter to make code more functional
  ipc.onmessage = handleMessage
  return {
    invoke(method, ...params) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}
