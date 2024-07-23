import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

let _ipc: any

export const listen = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.RendererProcess,
  })
  HandleIpc.handleIpc(ipc)
  _ipc = ipc
}

export const invoke = async (method: string, ...args: any) => {
  return JsonRpc.invoke(_ipc, method, ...args)
}
