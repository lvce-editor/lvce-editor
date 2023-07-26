import exitHook from 'exit-hook'
import * as Debug from '../Debug/Debug.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as PtyHostPath from '../PtyHostPath/PtyHostPath.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
  /**
   * @type {any}
   */
  ptyHostPromise: undefined,
  /**
   * @type {any[]}
   */
  pendingMessages: [],
  send(message) {
    state.pendingMessages.push(message)
  },
}

const cleanUpAll = () => {
  if (state.ipc) {
    state.ipc.dispose()
    state.ipc = undefined
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
    method: IpcParentType.NodeForkedProcess,
    path: ptyHostPath,
    argv: [],
    stdio: 'inherit',
    name: 'Terminal Process',
  })
  const handleClose = () => {
    ptyHost.off('close', handleClose)
    state.ipc = undefined
    state.ptyHostPromise = undefined
  }
  ptyHost.on('close', handleClose)
  state.ipc = ptyHost
  return ptyHost
}

export const getOrCreate = () => {
  Debug.debug('creating pty host')
  if (!state.ptyHostPromise) {
    state.ptyHostPromise = createPtyHost()
  }
  return state.ptyHostPromise
}

export const getCurrentInstance = () => {
  return state.ipc
}

export const disposeAll = () => {
  if (state.ipc) {
    state.ipc.removeAllListeners()
    if (state.ipc) {
      state.ipc.dispose()
      state.ipc = undefined
    }
    state.ptyHostState = /* None */ 0
    state.send = (message) => {
      state.pendingMessages.push(message)
    }
  }
}

export const invoke = (method, ...params) => {
  return JsonRpc.invoke(state.ipc, method, ...params)
}
