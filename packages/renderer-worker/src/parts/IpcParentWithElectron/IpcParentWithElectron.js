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

const getActualData = (event) => {
  if (event instanceof MessageEvent) {
    return event.data
  }
  return event
}

export const wrap = (port) => {
  return {
    port,
    /**
     * @type {any}
     */
    handleMessage: undefined,
    get onmessage() {
      return this.handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        this.handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          const data = getActualData(event)
          listener(data)
        }
      } else {
        this.handleMessage = null
      }
      this.port.onmessage = this.handleMessage
    },
    send(message) {
      this.port.postMessage(message)
    },
  }
}
