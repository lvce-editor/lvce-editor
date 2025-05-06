import * as IpcParent from '../IpcParent/IpcParent.js'
import * as PtyHostPath from '../PtyHostPath/PtyHostPath.js'
import * as PtyHostState from '../PtyHostState/PtyHostState.js'

export const launchPtyHost = async (method) => {
  const ptyHostPath = PtyHostPath.ptyHostPath
  const ptyHost = await IpcParent.create({
    method,
    path: ptyHostPath,
    argv: [],
    stdio: 'inherit',
    name: 'Terminal Process',
  })
  PtyHostState.state.ipc = ptyHost
  return ptyHost
}
