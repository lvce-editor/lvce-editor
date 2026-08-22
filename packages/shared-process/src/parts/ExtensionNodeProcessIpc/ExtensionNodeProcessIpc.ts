import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as ResolveExtensionNodeProcess from '../ResolveExtensionNodeProcess/ResolveExtensionNodeProcess.ts'

export const create = async ({ extensionId, method, rpcId }: any): Promise<any> => {
  const { name, path } = await ResolveExtensionNodeProcess.resolveExtensionNodeProcess(extensionId, rpcId)
  const ipc = await IpcParent.create({
    execArgv: [],
    method,
    name,
    path,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
