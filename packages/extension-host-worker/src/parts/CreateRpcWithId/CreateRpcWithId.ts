import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostRpcState from '../ExtensionHostRpcState/ExtensionHostRpcState.ts'
import * as ExtensionHostSubWorkerUrl from '../ExtensionHostSubWorkerUrl/ExtensionHostSubWorkerUrl.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as RpcParent from '../RpcParent/RpcParent.ts'
import * as RpcParentType from '../RpcParentType/RpcParentType.ts'

export const createRpcWithId = async ({ id, execute }: { id: string; execute: any }) => {
  Assert.string(id)
  const info = ExtensionHostRpcState.get(id)
  if (!info) {
    throw new Error(`rpc with id ${id} not found`)
  }
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: ExtensionHostSubWorkerUrl.extensionHostSubWorkerUrl,
    name: info.name,
  })
  const rpc = await RpcParent.create({
    ipc,
    method: RpcParentType.JsonRpc,
    execute,
  })
  await rpc.invoke('LoadFile.loadFile', info.url)
  return rpc
}
