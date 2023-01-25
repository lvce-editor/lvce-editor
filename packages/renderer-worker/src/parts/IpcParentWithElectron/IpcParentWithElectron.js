import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RendererProcessIpcParentType from '../RendererProcessIpcParentType/RendererProcessIpcParentType.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const create = async (options) => {
  const type = options.type
  Assert.string(type)
  const response = await new Promise((resolve, reject) => {
    const id = Callback.register(resolve, reject)
    RendererProcess.send({
      jsonrpc: JsonRpcVersion.Two,
      method: 'get-port',
      _id: id,
      params: [
        {
          method: RendererProcessIpcParentType.Electron,
          type,
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
