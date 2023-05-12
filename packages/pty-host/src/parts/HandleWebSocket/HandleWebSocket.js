import * as WebSocketServer from '../WebSocketServer/WebSocketServer.js'
import * as Assert from '../Assert/Assert.js'

let had = false
export const handleWebSocket = async (request, handle) => {
  if (had) {
    console.log('alreayd upgraded', request)
    return
  }
  had = true
  console.log('upgrade socket', request)
  Assert.object(request)
  Assert.object(handle)
  // console.log({ request, handle })
  // console.log('upgrade ws now')
  await WebSocketServer.handleUpgrade(request, handle)
  // TODO
  // console.log({ args })
}
