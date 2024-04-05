import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as LaunchRendererWorker from '../LaunchRendererWorker/LaunchRendererWorker.ts'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const hydrate = async () => {
  const ipc = await LaunchRendererWorker.launchRendererWorker()
  HandleIpc.handleIpc(ipc)
  // @ts-ignore
  state.ipc = ipc
}

// TODO needed?
export const dispose = () => {
  // @ts-ignore
  if (state.rendererWorker) {
    // @ts-ignore
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
  // @ts-ignore
  state.ipc.sendAndTransfer(message, transfer)
}
