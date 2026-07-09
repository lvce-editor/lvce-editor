import * as IsElectron from '../IsElectron/IsElectron.ts'
import * as LaunchProcess from '../LaunchProcess/LaunchProcess.ts'
import * as SearchProcessPath from '../SearchProcessPath/SearchProcessPath.ts'

export const launchSearchProcess = async (): Promise<any> => {
  const ipc = await LaunchProcess.launchProcess({
    name: 'Search Process',
    defaultPath: SearchProcessPath.searchProcessPath,
    isElectron: IsElectron.isElectron,
    settingName: 'develop.searchProcessPath',
    targetRpcId: undefined,
  })
  return ipc
}
