import * as NetworkProcessPath from '../NetworkProcessPath/NetworkProcessPath.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchNetworkProcess = async () => {
  const networkProcess = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path: NetworkProcessPath.networkProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'Network Process',
  })
  HandleIpc.handleIpc(networkProcess)
  return networkProcess
}
