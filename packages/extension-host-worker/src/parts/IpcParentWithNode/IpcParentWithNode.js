import { IpcError } from '../IpcError/IpcError.js'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.js'
import * as Rpc from '../Rpc/Rpc.js'

const getPort = async (type) => {
  const port = await Rpc.invoke('IpcParent.create', {
    method: RendererWorkerIpcParentType.Node,
    type,
    raw: true,
    protocol: 'lvce.extension-host-helper-process',
  })
  console.log({ port })
  if (!port) {
    throw new IpcError(`port must be defined`)
  }
  if (!(port instanceof MessagePort)) {
    throw new IpcError('port must be of type MessagePort')
  }
  return port
}

export const create = async ({ type }) => {
  const port = await getPort(type)
  return port
}

export const wrap = (port) => {
  let handleMessage
  return {
    get onmessage() {
      return handleMessage
    },
    set onmessage(listener) {
      let handleMessage
      if (listener) {
        handleMessage = (event) => {
          listener(event.data)
        }
      } else {
        handleMessage = null
      }
      port.onmessage = handleMessage
    },
    send(message) {
      port.postMessage(message)
    },
  }
}
