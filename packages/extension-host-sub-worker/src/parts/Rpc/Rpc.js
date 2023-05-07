import * as GetResponse from '../GetResponse/GetResponse.js'
import * as Assert from '../Assert/Assert.js'

export const listen = (ipc, execute) => {
  Assert.object(ipc)
  Assert.fn(execute)
  const handleMessage = async (message) => {
    if ('method' in message) {
      const response = await GetResponse.getResponse(message, execute)
      ipc.send(response)
    } else {
      console.log({ message })
    }
  }
  ipc.onmessage = handleMessage
}
