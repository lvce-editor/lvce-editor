import * as GetResponse from '../GetResponse/GetResponse.js'

export const listen = (ipc, execute) => {
  const handleMessage = async (message) => {
    if ('method' in message) {
      const response = await GetResponse.getResponse(message, execute)
      ipc.send(response)
    }
  }
  ipc.on('message', handleMessage)
}
