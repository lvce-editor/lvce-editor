import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

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
