import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as IpcParentWithModuleWorker from '../IpcParentWithModuleWorker/IpcParentWithModuleWorker.ts'
import * as IsWorker from '../IsWorker/IsWorker.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

// TODO add test
export const create = async ({ url, name, port }) => {
  const worker = await IpcParentWithModuleWorker.create({
    url,
    name,
  })
  if (!IsWorker.isWorker(worker)) {
    throw new IpcError(`worker must be of type Worker`)
  }
  const ipc = IpcParentWithModuleWorker.wrap(worker)
  HandleIpc.handleIpc(ipc)
  // TODO await promise
  // TODO call separate method HandleMessagePort.handleMessagePort or
  // HandleIncomingIpc.handleIncomingIpc
  JsonRpc.invokeAndTransfer(ipc, [port], 'initialize', 'message-port', port)
  HandleIpc.unhandleIpc(ipc)
  return undefined
}
