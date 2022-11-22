import * as Callback from '../Callback/Callback.js'
import { JsonRpcError } from '../Errors/Errors.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const isResultMessage = (message) => {
  return 'result' in message
}

const isErrorMessage = (message) => {
  return 'error' in message
}

const handleMessageMethod = async (message, event) => {
  if (message.method === 'ElectronMessagePort.create') {
    const IpcParentWithElectron = await import(
      '../IpcParent/IpcParentWithElectron.js'
    )
    const ipc = await IpcParentWithElectron.create({
      type: 'extension-host-helper-process',
    })
    event.target.postMessage(
      {
        jsonrpc: '2.0',
        id: message.id,
        result: ipc._port,
      },
      [ipc._port]
    )
    console.log({ ipc, event, target: event.target })
  }
}

const handleMessage = (message, event) => {
  if (message.id) {
    if (isResultMessage(message) || isErrorMessage(message)) {
      Callback.resolve(message.id, message)
    } else if ('method' in message) {
      handleMessageMethod(message, event)
    } else {
      throw new JsonRpcError('unexpected message type')
    }
  } else {
    throw new JsonRpcError('unexpected message type')
  }
}

export const listen = (ipc) => {
  // TODO maybe pass handleMessage as paramter to make code more functional
  ipc.onmessage = handleMessage
  return {
    invoke(method, ...params) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}
