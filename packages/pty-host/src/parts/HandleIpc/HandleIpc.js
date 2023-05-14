import * as Assert from '../Assert/Assert.js'
import * as GetResponse from '../GetResponse/GetResponse.js'

export const handleIpc = async (ipc) => {
  Assert.object(ipc)
  const handleMessage = async (message) => {
    const response = await GetResponse.getResponse(message, ipc)
    ipc.send(response)
  }
  ipc.on('message', handleMessage)
}
