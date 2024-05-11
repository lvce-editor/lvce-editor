import * as IpcParent from '../IpcParent/IpcParent.js'
import * as PtyHostPath from '../PtyHostPath/PtyHostPath.js'
import * as PtyHostState from '../PtyHostState/PtyHostState.js'

export const launchPtyHost = async (method) => {
  const ptyHostPath = await PtyHostPath.ptyHostPath
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
