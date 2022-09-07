import VError from 'verror'
import * as _ws from 'ws'
import * as Assert from '../Assert/Assert.js'

// workaround for jest or node bug
const WebSocketServer = _ws.WebSocketServer
  ? _ws.WebSocketServer
  : // @ts-ignore
    _ws.default.WebSocketServer

export const listen = async (processIpc) => {
  Assert.object(processIpc)
  console.log('[extension host] listening for websocket')

  const webSocketServer = new WebSocketServer({
    noServer: true,
  })

  const { message, handle } = await new Promise((resolve, reject) => {
    const handleFirstMessage = (message, handle) => {
      cleanup()
      if (handle) {
        resolve({ message, handle })
      } else {
        reject(new VError('websocket expected'))
      }
    }
    const cleanup = () => {
      processIpc.off('message', handleFirstMessage)
    }
    processIpc.on('message', handleFirstMessage)
    processIpc.send('ready')
  })

  console.log('[extension host] got socket')
  const webSocket = await new Promise((resolve, reject) => {
    const upgradeCallback = (webSocket) => {
      resolve(webSocket)
    }
    webSocketServer.handleUpgrade(
      message,
      handle,
      Buffer.alloc(0),
      upgradeCallback
    )
  })
  return {
    send(message) {
      const stringifiedMessage = JSON.stringify(message)
      webSocket.send(stringifiedMessage)
    },
    on(event, listener) {
      switch (event) {
        case 'message':
          const wrappedListener = (message) => {
            const parsed = JSON.parse(message.toString())
            listener(parsed)
          }
          webSocket.on('message', wrappedListener)
          break
        default:
          throw new Error('unknown event listener type')
      }
    },
  }
}
