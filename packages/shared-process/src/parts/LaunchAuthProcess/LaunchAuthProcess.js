import * as AuthProcessPath from '../AuthProcessPath/AuthProcessPath.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.js'

export const launchAuthProcess = async () => {
  const ipc = await LaunchProcess.launchProcess({
    name: 'Auth Process',
    targetRpcId: IpcId.AuthProcess,
    defaultPath: AuthProcessPath.authProcessPath,
    isElectron: IsElectron.isElectron,
    settingName: 'develop.authProcessPath',
  })
  return ipc
}
