import { IpcError } from '../IpcError/IpcError.js'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.js'
import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.js'
import * as Rpc from '../Rpc/Rpc.js'
import * as WaitForFirstMessage from '../WaitForFirstMessage/WaitForFirstMessage.js'

const getPort = async (type) => {
  const port = await Rpc.invoke('IpcParent.create', {
    method: RendererWorkerIpcParentType.NodeAlternate,
    type,
    raw: true,
    protocol: 'lvce.extension-host-helper-process',
    initialCommand: 'HandleElectronMessagePort.handleElectronMessagePort',
  })
  if (!port) {
    throw new IpcError(`port must be defined`)
  }
  if (!IsMessagePort.isMessagePort(port)) {
    throw new IpcError('port must be of type MessagePort')
  }
  const firstMessage = await WaitForFirstMessage.waitForFirstMessage(port)
  if (firstMessage !== 'ready') {
    throw new IpcError(`unexpected first message from message port`)
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
