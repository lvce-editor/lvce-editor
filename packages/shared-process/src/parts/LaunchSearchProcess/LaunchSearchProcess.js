import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SearchProcessPath from '../SearchProcessPath/SearchProcessPath.js'

const getConfiguredUrl = async () => {
  if (Platform.isProduction) {
    return SearchProcessPath.searchProcessPath
  }
  const allPreferences = await Preferences.getAll()
  const processPath = allPreferences['develop.searchProcessPath'] || SearchProcessPath.searchProcessPath
  return processPath
}

export const launchSearchProcess = async () => {
  const method = IsElectron.isElectron ? IpcParentType.ElectronUtilityProcess : IpcParentType.NodeForkedProcess
  const path = await getConfiguredUrl()
  const searchProcess = await IpcParent.create({
    method,
    path,
    argv: [],
    stdio: 'inherit',
    name: 'Search Process',
  })
  HandleIpc.handleIpc(searchProcess)
  return searchProcess
}
