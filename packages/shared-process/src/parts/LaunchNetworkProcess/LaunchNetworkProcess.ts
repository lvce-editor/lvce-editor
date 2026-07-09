import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'
import * as NetworkProcessPath from '../NetworkProcessPath/NetworkProcessPath.ts'

export const launchNetworkProcess = async () => {
  const ipc = await LaunchProcess.launchProcess({
    defaultPath: NetworkProcessPath.networkProcessPath,
    isElectron: IsElectron.isElectron,
    name: 'Network Process',
    settingName: 'develop.networkProcessPath',
    targetRpcId: undefined,
  })
  return ipc
}
