import { IpcError } from '../IpcError/IpcError.ts'
import * as IpcParentWithModuleWorker from '../IpcParentWithModuleWorker/IpcParentWithModuleWorker.ts'
import * as IsWorker from '../IsWorker/IsWorker.ts'
import * as JsonRpcEvent from '../JsonRpcEvent/JsonRpcEvent.ts'

export const create = async ({ url, name, port }) => {
  const worker = await IpcParentWithModuleWorker.create({
    url,
    name,
  })
  if (!IsWorker.isWorker(worker)) {
    throw new IpcError(`worker must be of type Worker`)
  }
  // TODO use invoke, then dispose initial ipc responses
  const message = JsonRpcEvent.create('initialize', ['message-port', port])
  worker.postMessage(message, [port])
  return undefined
}
