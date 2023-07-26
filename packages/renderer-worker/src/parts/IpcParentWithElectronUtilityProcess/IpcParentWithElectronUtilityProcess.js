import * as Assert from '../Assert/Assert.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RendererProcessIpcParentType from '../RendererProcessIpcParentType/RendererProcessIpcParentType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const getPort = async (type, name) => {
  const port = await SharedProcess.invoke('IpcParent.create', {
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
  return event.data
}

export const wrap = (port) => {
  return {
    port,
    /**
     * @type {any}
     */
    listener: undefined,
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      this.listener = listener
      const wrappedListener = (event) => {
        const data = getActualData(event)
        listener(data)
      }
      this.port.onmessage = wrappedListener
    },
    send(message) {
      this.port.postMessage(message)
    },
  }
}
