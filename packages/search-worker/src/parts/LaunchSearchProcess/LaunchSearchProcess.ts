import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const launchSearchProcess = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.NodeAlternate,
    type: 'search-process',
    name: 'Search Process',
    initialCommand: 'HandleMessagePortForSearchProcess.handleMessagePortForSearchProcess',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
