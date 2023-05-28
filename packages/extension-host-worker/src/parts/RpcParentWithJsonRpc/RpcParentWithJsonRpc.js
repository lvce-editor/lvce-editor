import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const create = ({ ipc, execute }) => {
  Assert.object(ipc)
  Assert.fn(execute)
  const handleMessage = async (message) => {
    if ('id' in message) {
      if ('method' in message) {
        const response = await GetResponse.getResponse(message, execute)
        ipc.send(response)
        return
      }
      Callback.resolve(message.id, message)
    }
  }
  ipc.onmessage = handleMessage
  return {
    ipc,
    invoke(method, ...params) {
      return JsonRpc.invoke(this.ipc, method, ...params)
    },
  }
}
