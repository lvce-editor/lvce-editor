import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as NetworkProcessPath from '../NetworkProcessPath/NetworkProcessPath.js'

export const launchNetworkProcess = async () => {
  const method = IsElectron.isElectron ? IpcParentType.ElectronUtilityProcess : IpcParentType.NodeForkedProcess
  const networkProcess = await IpcParent.create({
    method,
    path: NetworkProcessPath.networkProcessPath,
    argv: [],
    stdio: 'inherit',
    name: 'Network Process',
  })
  HandleIpc.handleIpc(networkProcess)
  return networkProcess
}
