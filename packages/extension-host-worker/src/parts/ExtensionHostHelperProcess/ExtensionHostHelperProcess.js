import * as Callback from '../Callback/Callback.js'
import * as ExtensionHostHelperProcessIpx from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js'

export const state = {
  /**
   * @type {any}
   */
  ipcPromise: undefined,
}

const handleMessage = (message) => {
  if ('result' in message) {
    Callback.resolve(message.id, message.result)
  } else if ('error' in message) {
    Callback.reject(message.id, message.error)
  } else {
    console.log({ message })
  }
}

export const getIpc = async () => {
  if (!state.ipcPromise) {
    state.ipcPromise = ExtensionHostHelperProcessIpx.create()
    const ipc = await state.ipcPromise
    ipc.onmessage = handleMessage
  }
  return state.ipcPromise
}

export const invoke = async (method, ...params) => {
  const ipc = await getIpc()
  return new Promise((resolve, reject) => {
    const id = Callback.register(resolve, reject)
    ipc.send({
      jsonrpc: '2.0',
      method,
      id,
      params,
    })
  })
}
