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
  // @ts-expect-error
  state.ipc = ipc
}

// TODO needed?
export const dispose = () => {
  // @ts-expect-error
  if (state.rendererWorker) {
    // @ts-expect-error
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
  // @ts-expect-error
  state.ipc.sendAndTransfer(message, transfer)
}

export const invokeAndTransfer = (method, transfer, ...params) => {
  return JsonRpc.invokeAndTransfer(state.ipc, transfer, method, ...params)
}
