import * as IsElectron from '../IsElectron/IsElectron.js'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.js'
import * as SearchProcessPath from '../SearchProcessPath/SearchProcessPath.js'

export const launchSearchProcess = async () => {
  const ipc = await LaunchProcess.launchProcess({
    name: 'Search Process',
    defaultPath: SearchProcessPath.searchProcessPath,
    isElectron: IsElectron.isElectron,
    settingName: 'develop.searchProcessPath',
    targetRpcId: undefined,
  })
  return ipc
}
