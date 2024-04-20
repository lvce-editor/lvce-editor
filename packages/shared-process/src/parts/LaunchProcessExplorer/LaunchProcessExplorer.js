import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as ProcessExplorerPath from '../ProcessExplorerPath/ProcessExplorerPath.js'

export const launchProcessExplorer = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ElectronUtilityProcess,
    path: ProcessExplorerPath.processExplorerPath,
    argv: [],
    stdio: 'inherit',
    name: 'Process Process',
  })
  HandleIpc.handleIpc(ipc)
  const { port1, port2 } = await GetPortTuple.getPortTuple()
  await JsonRpc.invokeAndTransfer(ipc, [port1], 'HandleElectronMessagePort.handleElectronMessagePort')
  await ParentIpc.invokeAndTransfer('HandleElectronMessagePort.handleElectronMessagePort', [port2])
  return ipc
}
