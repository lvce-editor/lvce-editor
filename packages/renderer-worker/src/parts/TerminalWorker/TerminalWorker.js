import * as LaunchTerminalWorker from '../LaunchTerminalWorker/LaunchTerminalWorker.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const state = {
  /**
   * @type {any}
   */
  workerPromise: undefined,
}

export const getOrCreate = () => {
  state.workerPromise ||= LaunchTerminalWorker.launchTerminalWorker()
  return state.workerPromise
}

export const invokeAndTransfer = async (transfer, method, ...params) => {
  const ipc = await state.workerPromise
  await JsonRpc.invokeAndTransfer(ipc, transfer, method, ...params)
}
