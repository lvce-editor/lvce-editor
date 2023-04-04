import { IpcError } from '../IpcError/IpcError.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.js'
import * as Rpc from '../Rpc/Rpc.js'

const getPort = async (type) => {
  const port = await JsonRpc.invoke(Rpc.state.ipc, 'IpcParent.create', {
    method: RendererWorkerIpcParentType.ElectronMessagePort,
    type,
    raw: true,
  })
  if (!port) {
    throw new IpcError(`port must be defined`)
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
