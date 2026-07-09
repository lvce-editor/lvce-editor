import * as IpcId from '../IpcId/IpcId.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'
import * as PtyHostPath from '../PtyHostPath/PtyHostPath.ts'
import * as PtyHostState from '../PtyHostState/PtyHostState.ts'

export const launchPtyHost = async (method) => {
  const ipc = await LaunchProcess.launchProcess({
    defaultPath: PtyHostPath.ptyHostPath,
    isElectron: IsElectron.isElectron,
    name: 'Terminal Process',
    settingName: 'develop.ptyHostPath',
    targetRpcId: IpcId.TerminalProcess,
  })
  PtyHostState.state.ipc = ipc
  return ipc
}
