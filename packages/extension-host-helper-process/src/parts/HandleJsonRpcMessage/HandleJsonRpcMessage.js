import * as GetResponse from '../GetResponse/GetResponse.js'

export const handleJsonRpcMessage = async (ipc, message, execute, resolve) => {
  console.log({ ipc, message })
  if ('result' in message || 'error' in message) {
    resolve(message.id, message)
    return
  }
  const response = await GetResponse.getResponse(message, execute)
  ipc.send(response)
}
