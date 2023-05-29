import * as Assert from '../Assert/Assert.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RendererProcessIpcParentType from '../RendererProcessIpcParentType/RendererProcessIpcParentType.js'

const getPort = async (type, name) => {
  const port = await RendererProcess.invoke('IpcParent.create', {
    method: RendererProcessIpcParentType.Electron,
    type,
    name,
  })
  return port
}

export const create = async (options) => {
  const type = options.type
  const name = options.name || 'electron ipc'
  Assert.string(type)
  Assert.string(name)
  const port = await getPort(type, name)
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
