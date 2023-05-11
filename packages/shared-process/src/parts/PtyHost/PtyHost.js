import exitHook from 'exit-hook'
import * as Debug from '../Debug/Debug.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as PtyHostPath from '../PtyHostPath/PtyHostPath.js'

export const state = {
  /**
   * @type {any}
   */
  ptyHost: undefined,
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
  if (state.ptyHost) {
    state.ptyHost.kill()
  }
}

const handleProcessExit = () => {
  Debug.debug('shared process exit, clean terminals')
  cleanUpAll()
}

const createPtyHost = async () => {
  exitHook(handleProcessExit)
  console.log('create pty host')
  const ptyHostPath = await PtyHostPath.getPtyHostPath()
  const ptyHost = await IpcParent.create({
    method: IpcParentType.NodeForkedProcess,
    path: ptyHostPath,
    argv: ['--ipc-type=node-forked-process'],
    stdio: 'inherit',
    name: 'Terminal Process',
  })
  state.ptyHost = ptyHost
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
  return state.ptyHost
}

export const disposeAll = () => {
  if (state.ptyHost) {
    state.ptyHost.removeAllListeners()
    state.ptyHost.kill()
    state.ptyHost = undefined
    state.ptyHostState = /* None */ 0
    state.send = (message) => {
      state.pendingMessages.push(message)
    }
  }
}
