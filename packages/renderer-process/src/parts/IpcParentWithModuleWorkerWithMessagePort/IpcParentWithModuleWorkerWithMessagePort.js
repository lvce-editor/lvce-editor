import * as IpcParentWithModuleWorker from '../IpcParentWithModuleWorker/IpcParentWithModuleWorker.js'
import * as JsonRpcEvent from '../JsonRpcEvent/JsonRpcEvent.js'

export const create = async ({ url, name }) => {
  const worker = await IpcParentWithModuleWorker.create({
    url,
    name,
  })
  if (worker instanceof Worker) {
    const channel = new MessageChannel()
    const { port1, port2 } = channel
    const message = JsonRpcEvent.create('initialize', ['message-port', port1])
    worker.postMessage(message, [port1])
    return port2
  }
  return worker
}
