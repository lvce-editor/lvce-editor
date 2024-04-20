import * as ProcessExplorerPath from '../ProcessExplorerPath/ProcessExplorerPath.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchProcessExplorer = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path: ProcessExplorerPath.processExplorerPath,
    argv: [],
    stdio: 'inherit',
    name: 'Process Process',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
