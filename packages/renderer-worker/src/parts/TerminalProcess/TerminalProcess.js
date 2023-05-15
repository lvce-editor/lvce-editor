/* istanbul ignore file */
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as TerminalProcessIpc from '../TerminalProcessIpc/TerminalProcessIpc.js'
import { VError } from '../VError/VError.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
  /**
   * @type {any}
   */
  ipcPromise: undefined,
}

const actuallyListen = async () => {
  try {
    const ipc = await TerminalProcessIpc.listen(IpcParentType.Node)
    HandleIpc.handleIpc(ipc, 'terminal process')
    state.ipc = ipc
  } catch (error) {
    throw new VError(error, `Failed to create terminal connection`)
  }
}

export const listen = async () => {
  if (!state.ipcPromise) {
    state.ipcPromise = actuallyListen()
  }
  return state.ipcPromise
}

export const invoke = (method, ...params) => {
  return JsonRpc.invoke(state.ipc, method, ...params)
}

export const send = (method, ...params) => {
  return JsonRpc.send(state.ipc, method, ...params)
}
