import * as Assert from '../Assert/Assert.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as WebSocketServer from '../WebSocketServer/WebSocketServer.js'

export const handleWebSocket = async (request, handle) => {
  Assert.object(request)
  Assert.object(handle)
  const webSocket = await WebSocketServer.handleUpgrade(request, handle)
  webSocket.pause()
  const ipc = await IpcChild.listen({
    method: IpcChildType.WebSocket,
    webSocket,
  })
  const handleMessage = async (message) => {
    const response = await GetResponse.getResponse(message, ipc)
    console.log({ response, message })
    ipc.send(response)
  }

  ipc.on('message', handleMessage)
  webSocket.resume()
}
