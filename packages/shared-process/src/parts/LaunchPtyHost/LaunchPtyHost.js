import exitHook from 'exit-hook'
import * as Debug from '../Debug/Debug.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
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

export const launchPtyHost = async (method) => {
  exitHook(handleProcessExit)
  const ptyHostPath = await PtyHostPath.getPtyHostPath()
  const ptyHost = await IpcParent.create({
    method,
    path: ptyHostPath,
    argv: [],
    stdio: 'inherit',
    name: 'Terminal Process',
  })
  // HandleIpc.handleIpc(ptyHost)
  // TODO
  // const handleClose = () => {
  //   // @ts-ignore
  //   ptyHost._rawIpc.off('close', handleClose)
  //   PtyHostState.state.ipc = undefined
  //   PtyHostState.state.ptyHostPromise = undefined
  // }
  // // @ts-ignore
  // ptyHost._rawIpc.on('close', handleClose)
  PtyHostState.state.ipc = ptyHost
  return ptyHost
}
