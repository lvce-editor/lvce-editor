import * as GetResponse from '../GetResponse/GetResponse.js'

export const listen = (ipc, execute) => {
  const handleMessage = async (message) => {
    if ('method' in message) {
      const response = await GetResponse.getResponse(message, execute)
      ipc.send(response)
    } else {
      console.log({ message })
    }
  }
  ipc.on('message', handleMessage)
}
