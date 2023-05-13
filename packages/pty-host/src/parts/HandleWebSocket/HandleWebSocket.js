import * as WebSocketServer from '../WebSocketServer/WebSocketServer.js'
import * as Assert from '../Assert/Assert.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

const handleMessage = (message) => {
  console.log('got message', message)
}

export const handleWebSocket = async (request, handle) => {
  Assert.object(request)
  Assert.object(handle)
  const webSocket = await WebSocketServer.handleUpgrade(request, handle)
  webSocket.pause()
  const ipc = await IpcChild.listen({
    method: IpcChildType.WebSocket,
    webSocket,
  })
  ipc.on('message', handleMessage)
  webSocket.resume()
}
