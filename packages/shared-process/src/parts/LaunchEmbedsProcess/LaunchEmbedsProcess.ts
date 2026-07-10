import * as ConnectIpcToElectron from '../ConnectIpcToElectron/ConnectIpcToElectron.ts'
import * as EmbedsProcessPath from '../EmbedsProcessPath/EmbedsProcessPath.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'

export const launchEmbedsProcess = async (): Promise<any> => {
  const ipc = await LaunchProcess.launchProcess({
    defaultPath: EmbedsProcessPath.embedsProcessPath,
    isElectron: IsElectron.isElectron,
    name: 'Embeds Process',
    settingName: 'develop.embedsProcessPath',
    targetRpcId: IpcId.EmbedsProcess,
  })
  // TODO embeds worker itself should connect to main process
  await ConnectIpcToElectron.connectIpcToMainProcess2(ipc, IpcId.EmbedsProcess)
  return ipc
}
