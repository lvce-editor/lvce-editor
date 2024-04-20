import * as SearchProcessPath from '../SearchProcessPath/SearchProcessPath.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchSearchProcess = async () => {
  const embedsProcess = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path: SearchProcessPath.searchProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'Search Process',
  })
  HandleIpc.handleIpc(embedsProcess)
  return embedsProcess
}
