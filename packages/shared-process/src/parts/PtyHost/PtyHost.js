import exitHook from 'exit-hook'
import * as Debug from '../Debug/Debug.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as PtyHostPath from '../PtyHostPath/PtyHostPath.js'
import * as PtyHostState from '../PtyHostState/PtyHostState.js'

const cleanUpAll = () => {
  if (PtyHostState.state.ipc) {
    PtyHostState.state.ipc.dispose()
    PtyHostState.state.ipc = undefined
  }
}

const handleProcessExit = () => {
  Debug.debug('shared process exit, clean terminals')
  cleanUpAll()
}

const createPtyHost = async () => {
  exitHook(handleProcessExit)
  const ptyHostPath = await PtyHostPath.getPtyHostPath()
  const ptyHost = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path: ptyHostPath,
    argv: [],
    stdio: 'inherit',
    name: 'Terminal Process',
  })
  const handleClose = () => {
    ptyHost.off('close', handleClose)
    PtyHostState.state.ipc = undefined
    PtyHostState.state.ptyHostPromise = undefined
  }
  ptyHost.on('close', handleClose)
  PtyHostState.state.ipc = ptyHost
  return ptyHost
}

export const getOrCreate = () => {
  Debug.debug('creating pty host')
  if (!PtyHostState.state.ptyHostPromise) {
    PtyHostState.state.ptyHostPromise = createPtyHost()
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
