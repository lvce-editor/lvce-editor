import * as Debug from '../Debug/Debug.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as LaunchPtyHost from '../LaunchPtyHost/LaunchPtyHost.js'
import * as PtyHostState from '../PtyHostState/PtyHostState.js'

const cleanUpAll = () => {
  if (PtyHostState.state.ipc) {
    PtyHostState.state.ipc.dispose()
    PtyHostState.state.ipc = undefined
  }
}

export const getOrCreate = (method = IpcParentType.NodeForkedProcess) => {
  Debug.debug('creating pty host')
  if (!PtyHostState.state.ptyHostPromise) {
    PtyHostState.state.ptyHostPromise = LaunchPtyHost.launchPtyHost(method)
  }
  return PtyHostState.state.ptyHostPromise
}

export const getCurrentInstance = () => {
  return PtyHostState.state.ipc
}

export const disposeAll = () => {
  if (PtyHostState.state.ipc) {
    PtyHostState.state.ipc.removeAllListeners()
    if (PtyHostState.state.ipc) {
      PtyHostState.state.ipc.dispose()
      PtyHostState.state.ipc = undefined
    }
    PtyHostState.state.ptyHostState = /* None */ 0
    PtyHostState.state.send = (message) => {
      PtyHostState.state.pendingMessages.push(message)
    }
  }
}

export const invoke = (method, ...params) => {
  return JsonRpc.invoke(PtyHostState.state.ipc, method, ...params)
}
