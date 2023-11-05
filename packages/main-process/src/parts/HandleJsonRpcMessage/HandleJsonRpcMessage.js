import * as GetResponse from '../GetResponse/GetResponse.js'
import * as GetErrorResponse from '../GetErrorResponse/GetErrorResponse.js'

export const handleJsonRpcMessage = async (ipc, message, execute, resolve) => {
  if ('result' in message || 'error' in message) {
    resolve(message.id, message)
    return
  }
  const response = await GetResponse.getResponse(message, execute, ipc)
  try {
    ipc.send(response)
  } catch (error) {
    console.log({ error })
  }
}
