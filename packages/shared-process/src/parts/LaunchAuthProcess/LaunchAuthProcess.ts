import * as AuthProcessPath from '../AuthProcessPath/AuthProcessPath.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'

export const launchAuthProcess = async (): Promise<any> => {
  const ipc = await LaunchProcess.launchProcess({
    defaultPath: AuthProcessPath.authProcessPath,
    isElectron: IsElectron.isElectron,
    name: 'Auth Process',
    settingName: 'develop.authProcessPath',
    targetRpcId: IpcId.AuthProcess,
  })
  return ipc
}
