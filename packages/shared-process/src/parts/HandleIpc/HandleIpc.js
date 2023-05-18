import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as GetResponse from '../GetResponse/GetResponse.js'

const handleJsonRpcResult = (message) => {
  Callback.resolve(message.id, message.result)
}

export const handleIpc = (ipc) => {
  const handleJsonRpcMessage = async (message) => {
    if (message.method) {
      const response = await GetResponse.getResponse(message, ipc)
      ipc.send(response)
    } else {
      // TODO handle error
      Command.execute(message.method, ...message.params)
    }
  }

  const handleMessageFromParentProcess = async (message) => {
    if (message.result) {
      return handleJsonRpcResult(message)
    }
    if (message.method) {
      return handleJsonRpcMessage(message)
    }
    console.warn('unknown message', message)
  }
  ipc.on('message', handleMessageFromParentProcess)
}
