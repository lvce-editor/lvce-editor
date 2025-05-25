import * as ConnectIpcToElectron from '../ConnectIpcToElectron/ConnectIpcToElectron.js'
import * as EmbedsProcessPath from '../EmbedsProcessPath/EmbedsProcessPath.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.js'

export const launchEmbedsProcess = async () => {
  const ipc = await LaunchProcess.launchProcess({
    name: 'Embeds Process',
    targetRpcId: IpcId.EmbedsProcess,
    defaultPath: EmbedsProcessPath.embedsProcessPath,
    isElectron: IsElectron.isElectron,
    settingName: 'develop.embedsProcessPath',
  })
  await ConnectIpcToElectron.connectIpcToMainProcess2(ipc, IpcId.EmbedsProcess)
  return ipc
}
