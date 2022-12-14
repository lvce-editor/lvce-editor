import * as Callback from '../Callback/Callback.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RendererProcessIpcParentType from '../RendererProcessIpcParentType/RendererProcessIpcParentType.js'

export const create = async ({ url, name }) => {
  const response = await new Promise((resolve, reject) => {
    const id = Callback.register(resolve, reject)
    RendererProcess.send({
      jsonrpc: '2.0',
      method: 'get-port',
      _id: id,
      params: [
        {
          method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
          url,
          name,
        },
      ],
    })
  })
  const port = response.result
  return port
}

export const wrap = (port) => {
  let handleMessage
  return {
    get onmessage() {
      return port.onmessage
    },
    set onmessage(listener) {
      if (listener) {
        handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          if (event instanceof MessageEvent) {
            const message = event.data
            listener(message)
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
    sendAndTransfer(message, transfer) {
      port.postMessage(message, transfer)
    },
  }
}
