import * as Assert from '../Assert/Assert.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as ProcessExplorerFrontendIpc from '../ProcessExplorerFrontendIpc/ProcessExplorerFrontendIpc.js'

export const handleElectronMessagePort = async (messagePort, ipcId) => {
  Assert.object(messagePort)
  // Assert.number(ipcId)
  const ipc = await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
  HandleIpc.handleIpc(ipc)
  if (ipcId === IpcId.MainProcess) {
    ParentIpc.state.ipc = ipc
  } else if (ipcId === IpcId.ProcessExplorerRenderer) {
    // TODO how to connect message ports to the correct
    // renderer process?
    ProcessExplorerFrontendIpc.state.ipc = ipc
  }
}
