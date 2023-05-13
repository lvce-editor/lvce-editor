import * as WebSocketServer from '../WebSocketServer/WebSocketServer.js'
import * as Assert from '../Assert/Assert.js'

export const handleWebSocket = async (request, handle) => {
  Assert.object(request)
  Assert.object(handle)
  // console.log({ request, handle })
  // console.log('upgrade ws now')
  const webSocket = await WebSocketServer.handleUpgrade(request, handle)
  console.log({ webSocket })
  // TODO
  // console.log({ args })
}
