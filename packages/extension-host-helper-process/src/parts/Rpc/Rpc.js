import * as GetResponse from '../GetResponse/GetResponse.js'

export const listen = (ipc) => {
  const handleMessage = async (message) => {
    if ('method' in message) {
      const response = await GetResponse.getResponse(message)
      ipc.send(response)
    }
  }
  ipc.on('message', handleMessage)
  if (process.send) {
    process.send('ready')
  }
}
