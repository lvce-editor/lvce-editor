import * as IpcId from '../IpcId/IpcId.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'
import * as PtyHostPath from '../PtyHostPath/PtyHostPath.ts'

export const launchPtyHost = async (method: any): Promise<any> => {
  const ipc = await LaunchProcess.launchProcess({
    defaultPath: PtyHostPath.ptyHostPath,
    isElectron: IsElectron.isElectron,
    name: 'Terminal Process',
    settingName: 'develop.ptyHostPath',
    targetRpcId: IpcId.TerminalProcess,
  })
  return ipc
}
