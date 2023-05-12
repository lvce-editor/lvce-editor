import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as GetResponse from '../GetResponse/GetResponse.js'

export const electronInitialize = (port, folder) => {
  // TODO handle error
  const fakeSocket = {
    send: port.postMessage.bind(port),
    on(event, listener) {
      switch (event) {
        case 'close':
          port.on('close', listener)
          break
        case 'message':
          port.on('message', listener)
          break
        default:
          console.warn('socket event not implemented', event, listener)
          break
      }
    },
  }
  const handleOtherMessagesFromMessagePort = async (message) => {
    // console.log('got port message', message)
    if (message.result) {
      Callback.resolve(message.id, message.result)
    } else if (message.method) {
      if (message.id) {
        const response = await GetResponse.getResponse(message, fakeSocket)
        port.postMessage(response)
      } else {
        console.warn(`[shared process] sending messages without id is deprecated: ${message.method}`)
        Command.execute(message.method, fakeSocket, ...message.params)
      }
    } else {
      console.warn('unknown message', message)
    }
  }
  port.on('message', handleOtherMessagesFromMessagePort)
}
