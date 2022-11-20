import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Assert from '../Assert/Assert.js'

export const create = async (options) => {
  const type = options.type
  Assert.string(type)
  const originalOnMessage = RendererProcess.state.ipc.onmessage
  const port = await new Promise((resolve, reject) => {
    RendererProcess.state.ipc.onmessage = (event) => {
      if (event.data === 'port') {
        const port = event.ports[0]
        resolve(port)
      } else {
        originalOnMessage(event)
      }
    }
    RendererProcess.state.ipc.send({ method: 'get-port', params: [type] })
  })
  RendererProcess.state.ipc.onmessage = originalOnMessage
  let handleMessage
  return {
    get onmessage() {
      return handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          if (event instanceof MessageEvent) {
            listener(event.data)
          } else {
            listener(event)
          }
        }
      } else {
        handleMessage = null
      }
      port.onmessage = handleMessage
    },
    send(message) {
      port.postMessage(message)
    },
    _port: port,
  }
}
