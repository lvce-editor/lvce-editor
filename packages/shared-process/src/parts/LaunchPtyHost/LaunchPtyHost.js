import * as IpcId from '../IpcId/IpcId.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.js'
import * as PtyHostPath from '../PtyHostPath/PtyHostPath.js'
import * as PtyHostState from '../PtyHostState/PtyHostState.js'

export const launchPtyHost = async (method) => {
  const ipc = await LaunchProcess.launchProcess({
    defaultPath: PtyHostPath.ptyHostPath,
    isElectron: IsElectron.isElectron,
    name: 'Terminal Process',
    settingName: '',
    targetRpcId: IpcId.TerminalProcess,
  })
  PtyHostState.state.ipc = ipc
  return ipc
}
