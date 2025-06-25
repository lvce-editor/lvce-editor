import * as IsElectron from '../IsElectron/IsElectron.js'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.js'
import * as NetworkProcessPath from '../NetworkProcessPath/NetworkProcessPath.js'

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
