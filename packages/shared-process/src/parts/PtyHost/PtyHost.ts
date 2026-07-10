import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as LaunchPtyHost from '../LaunchPtyHost/LaunchPtyHost.ts'
import * as PtyHostState from '../PtyHostState/PtyHostState.ts'

export const getOrCreate = (method: any = IpcParentType.NodeForkedProcess): any => {
  if (!PtyHostState.state.ptyHostPromise) {
    PtyHostState.state.ptyHostPromise = LaunchPtyHost.launchPtyHost(method)
  }
  return PtyHostState.state.ptyHostPromise
}

export const getCurrentInstance = (): any => {
  return PtyHostState.state.ipc
}

export const disposeAll = (): any => {
  if (PtyHostState.state.ipc) {
    PtyHostState.state.ipc.removeAllListeners()
    if (PtyHostState.state.ipc) {
      PtyHostState.state.ipc.dispose()
      PtyHostState.state.ipc = undefined
    }
    PtyHostState.state.ptyHostState = /* None */ 0
    PtyHostState.state.send = (message: any): void => {
      PtyHostState.state.pendingMessages.push(message)
    }
  }
}

export const invoke = (method: any, ...params: any): any => {
  return JsonRpc.invoke(PtyHostState.state.ipc, method, ...params)
}
