import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

let _ipc: any

export const listen = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ExtensionHostWorker,
  })
  HandleIpc.handleIpc(ipc)
  _ipc = ipc
}

export const invoke = (method: string, ...params: any[]) => {
  return JsonRpc.invoke(_ipc, method, ...params)
}
