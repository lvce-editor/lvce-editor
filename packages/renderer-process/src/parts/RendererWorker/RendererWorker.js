import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import { JsonRpcError } from '../Errors/JsonRpcError.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as Platform from '../Platform/Platform.js'

// const URL_RENDERER_WORKER =
// '/packages/renderer-worker/distmin/rendererWorkerMain-0ead0bed.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

const handleMessageFromRendererWorker = async (event) => {
  const message = event.data
  if (message.id) {
    if ('method' in message) {
      try {
        const result = await Command.execute(message.method, ...message.params)
        state.ipc.send({
          jsonrpc: '2.0',
          id: message.id,
          result,
        })
        return
      } catch (error) {
        state.ipc.send({
          jsonrpc: '2.0',
          id: message.id,
          error,
        })
      }
      return
    }
    if ('result' in message) {
      Callback.resolve(message.id, message.result)
      return
    }
    if ('error' in message) {
      Callback.reject(message.id, message.error)
      return
    }
  }
  throw new JsonRpcError('unexpected message from renderer process')
}

const getIpc = async () => {
  const assetDir = Platform.getAssetDir()
  const urlRendererWorker = `${assetDir}/packages/renderer-worker/src/rendererWorkerMain.js`
  const rendererWorker = await IpcParent.create({
    method: IpcParent.Methods.ModuleWorker,
    url: urlRendererWorker,
    name: 'Renderer Worker',
  })
  return {
    send(message) {
      rendererWorker.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      rendererWorker.postMessage(message, transferables)
    },
    get onmessage() {
      return rendererWorker.onmessage
    },
    set onmessage(listener) {
      rendererWorker.onmessage = listener
    },
  }
}

export const hydrate = async (config) => {
  const ipc = await getIpc()

  // setup electron message port
  if (Platform.isElectron()) {
    await new Promise((resolve) => {
      const handleMessage = (event) => {
        const port = event.ports[0]
        // console.log(message)
        ipc.sendAndTransfer('port', [port])
        console.log('sent port')
        resolve()
      }

      // @ts-ignore
      window.addEventListener('message', handleMessage, { once: true })
      // @ts-ignore
      window.myApi.ipcConnect()
    })
  }
  ipc.onmessage = handleMessageFromRendererWorker
  state.ipc = ipc
}

// TODO needed?
export const dispose = () => {
  if (state.rendererWorker) {
    state.rendererWorker.terminate()
  }
}

export const send = (method, ...params) => {
  state.ipc.send({
    jsonrpc: '2.0',
    method,
    params,
  })
}

export const invoke = async (method, ...params) => {
  const responseMessage = await new Promise((resolve, reject) => {
    const callbackId = Callback.register(resolve, reject)
    state.ipc.send({
      jsonrpc: '2.0',
      method,
      params,
      id: callbackId,
    })
  })
  if (responseMessage instanceof Error) {
    throw responseMessage
  }
  return responseMessage
}

export const sendAndTransfer = (message, transfer) => {
  state.ipc.sendAndTransfer(message, transfer)
}
