import { IpcError } from '../IpcError/IpcError.ts'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.ts'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const getPort = async (type) => {
  const port = await Rpc.invoke('IpcParent.create', {
    method: RendererWorkerIpcParentType.NodeAlternate,
    type,
    raw: true,
    initialCommand: 'HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess',
  })
  if (!port) {
    throw new IpcError(`port must be defined`)
  }
  if (!IsMessagePort.isMessagePort(port)) {
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
