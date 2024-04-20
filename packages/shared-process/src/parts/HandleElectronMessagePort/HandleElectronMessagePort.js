import * as Assert from '../Assert/Assert.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

const mainProcessSpecialId = -5

export const handleElectronMessagePort = async (messagePort, ...params) => {
  Assert.object(messagePort)
  const ipc = await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
  HandleIpc.handleIpc(ipc)
  if (params[0] === mainProcessSpecialId) {
    // update ipc with message port ipc that supports transferring objects
    // @ts-ignore
    ParentIpc.state.ipc = ipc
  }
  // TODO find better way to associate configuration with ipc
  // @ts-ignore
  ipc.windowId = params[1]
}
