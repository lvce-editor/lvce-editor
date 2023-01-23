import * as Callback from '../Callback/Callback.js'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as GetResponse from '../GetResponse/GetResponse.js'

const isResultMessage = (message) => {
  return 'result' in message
}

const isErrorMessage = (message) => {
  return 'error' in message
}

const handleMessageMethod = async (message, event) => {
  if (message.method === 'ElectronMessagePort.create') {
    const IpcParentWithElectron = await import('../IpcParentWithElectron/IpcParentWithElectron.js')
    const ipc = await IpcParentWithElectron.create({
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
