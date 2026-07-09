import * as ConnectIpcToElectron from '../ConnectIpcToElectron/ConnectIpcToElectron.ts'
import * as EmbedsProcessPath from '../EmbedsProcessPath/EmbedsProcessPath.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'

export const launchEmbedsProcess = async (): Promise<any> => {
  const ipc = await LaunchProcess.launchProcess({
    name: 'Embeds Process',
    targetRpcId: IpcId.EmbedsProcess,
    defaultPath: EmbedsProcessPath.embedsProcessPath,
    isElectron: IsElectron.isElectron,
    settingName: 'develop.embedsProcessPath',
  })
  // TODO embeds worker itself should connect to main process
  await ConnectIpcToElectron.connectIpcToMainProcess2(ipc, IpcId.EmbedsProcess)
  return ipc
}
