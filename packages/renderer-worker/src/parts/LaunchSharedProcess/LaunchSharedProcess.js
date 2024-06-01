import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as SharedProcessIpc from '../SharedProcessIpc/SharedProcessIpc.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

export const launchSharedProcess = async () => {
  const ipc = await SharedProcessIpc.listen(IpcParentType.Node)
  HandleIpc.handleIpc(ipc)
  SharedProcessState.state.ipc = ipc
}
