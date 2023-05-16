import * as Callback from '../Callback/Callback.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as Platform from '../Platform/Platform.js'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

const getIpc = async () => {
  const isElectron = Platform.isElectron()
  const name = isElectron ? 'Renderer Worker (Electron)' : 'Renderer Worker'
  const rendererWorker = await IpcParent.create({
    method: IpcParentType.Auto,
    url: Platform.getRendererWorkerUrl(),
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
  state.ipc.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
  })
}

export const invoke = async (method, ...params) => {
  const { id, promise } = Callback.registerPromise()
  state.ipc.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
    id,
  })
  const responseMessage = await promise
  const result = UnwrapJsonRpcResult.unwrapJsonRpcResult(responseMessage)
  return result
}

export const sendAndTransfer = (message, transfer) => {
  state.ipc.sendAndTransfer(message, transfer)
}
