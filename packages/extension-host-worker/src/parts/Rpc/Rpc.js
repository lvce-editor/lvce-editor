import * as Callback from '../Callback/Callback.js'
import * as GetResponse from '../GetResponse/GetResponse.js'

export const listen = (ipc) => {
  const handleMessage = async (event) => {
    const message = event.data
    if ('method' in message) {
      const response = await GetResponse.getResponse(message)
      ipc.send(response)
    } else if ('result' in message) {
      Callback.resolve(message.id, message.result)
    } else if ('error' in message) {
      Callback.reject(message.id, message.error)
    } else {
      console.log({ message })
    }
  }
  ipc.onmessage = handleMessage
}
