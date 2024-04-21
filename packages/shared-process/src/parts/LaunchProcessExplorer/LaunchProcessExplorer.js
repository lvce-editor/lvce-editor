import * as ConnectIpcToElectron from '../ConnectIpcToElectron/ConnectIpcToElectron.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as ProcessExplorerPath from '../ProcessExplorerPath/ProcessExplorerPath.js'

export const launchProcessExplorer = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path: ProcessExplorerPath.processExplorerPath,
    argv: [],
    stdio: 'inherit',
    name: 'Process Explorer',
  })
  HandleIpc.handleIpc(ipc)
  await ConnectIpcToElectron.connectIpcToElectron(ipc)
  return ipc
}
