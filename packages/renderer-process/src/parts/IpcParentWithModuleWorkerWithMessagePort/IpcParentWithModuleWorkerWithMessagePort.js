import * as IpcParentWithModuleWorker from '../IpcParentWithModuleWorker/IpcParentWithModuleWorker.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const create = async ({ url, name }) => {
  const worker = await IpcParentWithModuleWorker.create({
    url,
    name,
  })
  if (worker instanceof Worker) {
    const channel = new MessageChannel()
    const { port1, port2 } = channel
    worker.postMessage(
      {
        jsonrpc: JsonRpcVersion.Two,
        method: 'initialize',
        params: ['message-port', port1],
      },
      [port1]
    )
    return port2
  }
  return worker
}
