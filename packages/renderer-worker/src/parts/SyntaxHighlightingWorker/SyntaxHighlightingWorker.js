import * as LaunchSyntaxHighlightingWorker from '../LaunchSyntaxHighlightingWorker/LaunchSyntaxHighlightingWorker.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const state = {
  /**
   * @type {any}
   */
  workerPromise: undefined,
}

export const getOrCreate = () => {
  state.workerPromise ||= LaunchSyntaxHighlightingWorker.launchSyntaxHighlightingWorker()
  return state.workerPromise
}

export const invokeAndTransfer = async (transfer, method, ...params) => {
  const ipc = await state.workerPromise
  await JsonRpc.invokeAndTransfer(ipc, transfer, method, ...params)
}

export const invoke = async (method, ...params) => {
  const ipc = await state.workerPromise
  await JsonRpc.invoke(ipc, method, ...params)
}
