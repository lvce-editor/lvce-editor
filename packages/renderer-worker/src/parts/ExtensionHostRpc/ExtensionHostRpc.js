import * as Callback from '../Callback/Callback.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

const isResultMessage = (message) => {
  return 'result' in message
}

const isErrorMessage = (message) => {
  return 'error' in message
}

const handleMessageMethod = async (message, event) => {
  if (message.method === 'ElectronMessagePort.create') {
    const ipc = await IpcParent.create({
      method: IpcParentType.ElectronMessagePort,
      type: 'extension-host-helper-process',
    })
    event.target.postMessage(
      {
        jsonrpc: JsonRpcVersion.Two,
        id: message.id,
        result: ipc._port,
      },
      [ipc._port]
    )
  } else if (message.method === 'Test.executeMockExecFunction') {
    const response = await GetResponse.getResponse(message)
    event.target.send(response)
  } else if (message.method === 'get-port') {
    const ipc = await IpcParent.create({
      method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
      url: message.params[0],
      name: message.params[1],
    })
    const port = ipc._port
    if (!port) {
      throw new Error('failed to create message port')
    }
    event.target.send(
      {
        jsonrpc: JsonRpcVersion.Two,
        id: message.id,
        result: port,
      },
      [port]
    )
  } else {
    await GlobalEventBus.emitEvent(message.method, ...message.params)
  }
}

const handleMessage = async (message, event) => {
  if (message.id) {
    if (isResultMessage(message) || isErrorMessage(message)) {
      Callback.resolve(message.id, message)
    } else if ('method' in message) {
      handleMessageMethod(message, event)
    } else {
      throw new JsonRpcError('unexpected message type')
    }
  } else if (message.method) {
    await GlobalEventBus.emitEvent(message.method, ...message.params)
  } else {
    throw new JsonRpcError('unexpected message type')
  }
}

export const listen = (ipc) => {
  // TODO maybe pass handleMessage as parameter to make code more functional
  ipc.onmessage = handleMessage
  return {
    invoke(method, ...params) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}
