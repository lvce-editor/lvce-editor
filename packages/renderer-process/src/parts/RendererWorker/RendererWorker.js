import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as LaunchRendererWorker from '../LaunchRendererWorker/LaunchRendererWorker.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const hydrate = async () => {
  const ipc = await LaunchRendererWorker.launchRendererWorker()
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
  JsonRpc.send(state.ipc, method, ...params)
}

export const invoke = (method, ...params) => {
  return JsonRpc.invoke(state.ipc, method, ...params)
}

export const sendAndTransfer = (message, transfer) => {
  state.ipc.sendAndTransfer(message, transfer)
}
