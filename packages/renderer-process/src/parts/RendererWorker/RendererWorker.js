import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as JsonRpcEvent from '../JsonRpcEvent/JsonRpcEvent.js'
import * as JsonRpcRequest from '../JsonRpcRequest/JsonRpcRequest.js'
import * as RendererWorkerUrl from '../RendererWorkerUrl/RendererWorkerUrl.js'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

const getIpc = async () => {
  const isElectron = IsElectron.isElectron()
  const name = isElectron ? 'Renderer Worker (Electron)' : 'Renderer Worker'
  const rendererWorker = await IpcParent.create({
    method: IpcParentType.Auto,
    url: RendererWorkerUrl.rendererWorkerUrl,
    name,
  })
  return {
    send(message) {
      rendererWorker.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      rendererWorker.postMessage(message, transferables)
    },
    get onmessage() {
      return rendererWorker.onmessage
    },
    set onmessage(listener) {
      rendererWorker.onmessage = listener
    },
  }
}

export const hydrate = async (config) => {
  const ipc = await getIpc()
  HandleIpc.handleIpc(ipc)
  state.ipc = ipc
}

// TODO needed?
export const dispose = () => {
  if (state.rendererWorker) {
    state.rendererWorker.terminate()
  }
}

export const send = (method, ...params) => {
  const message = JsonRpcEvent.create(method, params)
  state.ipc.send(message)
}

export const invoke = async (method, ...params) => {
  const { message, promise } = JsonRpcRequest.create(method, params)
  state.ipc.send(message)
  const responseMessage = await promise
  const result = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  return result
}

export const sendAndTransfer = (message, transfer) => {
  state.ipc.sendAndTransfer(message, transfer)
}
