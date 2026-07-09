import * as AuthProcessPath from '../AuthProcessPath/AuthProcessPath.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'

export const launchAuthProcess = async (): Promise<any> => {
  const ipc = await LaunchProcess.launchProcess({
    name: 'Auth Process',
    targetRpcId: IpcId.AuthProcess,
    defaultPath: AuthProcessPath.authProcessPath,
    isElectron: IsElectron.isElectron,
    settingName: 'develop.authProcessPath',
  })
  return ipc
}
