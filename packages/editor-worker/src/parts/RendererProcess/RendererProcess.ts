import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const listen = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.RendererProcess,
  })
  HandleIpc.handleIpc(ipc)
}
