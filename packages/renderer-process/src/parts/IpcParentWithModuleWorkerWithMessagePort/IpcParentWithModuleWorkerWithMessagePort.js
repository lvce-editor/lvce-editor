import { IpcError } from '../IpcError/IpcError.js'
import * as IpcParentWithModuleWorker from '../IpcParentWithModuleWorker/IpcParentWithModuleWorker.js'
import * as IsWorker from '../IsWorker/IsWorker.js'
import * as JsonRpcEvent from '../JsonRpcEvent/JsonRpcEvent.js'

export const create = async ({ url, name, port }) => {
  const worker = await IpcParentWithModuleWorker.create({
    url,
    name,
  })
  if (!IsWorker.isWorker(worker)) {
    throw new IpcError(`worker must be of type Worker`)
  }
  // TODO use invoke
  const message = JsonRpcEvent.create('initialize', ['message-port', port])
  worker.postMessage(message, [port])
  return undefined
}
