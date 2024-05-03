import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as SearchProcessPath from '../SearchProcessPath/SearchProcessPath.js'

export const launchSearchProcess = async () => {
  const method = IsElectron.isElectron ? IpcParentType.ElectronUtilityProcess : IpcParentType.NodeForkedProcess
  const searchProcess = await IpcParent.create({
    method,
    path: SearchProcessPath.searchProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'Search Process',
  })
  HandleIpc.handleIpc(searchProcess)
  return searchProcess
}
