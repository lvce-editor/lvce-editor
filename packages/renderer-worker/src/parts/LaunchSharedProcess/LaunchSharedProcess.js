import * as FileWatcher from '../FileWatcher/FileWatcher.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as SharedProcessIpc from '../SharedProcessIpc/SharedProcessIpc.js'
import * as SharedProcessState from '../SharedProcessState/SharedProcessState.js'

export const launchSharedProcess = async () => {
  const ipc = await SharedProcessIpc.listen(IpcParentType.Node)
  const eventSource = ipc.webSocket || ipc.port
  eventSource.addEventListener('close', FileWatcher.handleSharedProcessClose)
  HandleIpc.handleIpc(ipc)
  SharedProcessState.state.ipc = ipc
}
