import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as WebWorker from '../WebWorker/WebWorker.js'

// const URL_RENDERER_WORKER =
// '/packages/renderer-worker/distmin/rendererWorkerMain-0ead0bed.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

const handleMessageFromRendererWorker = async (event) => {
  const data = event.data
  if (data.method && data.id) {
    try {
      const result = await Command.execute(data.method, ...data.params)
      state.ipc.send({
        jsonrpc: '2.0',
        id: data.id,
        result,
      })
      return
    } catch (error) {
      state.ipc.send({
        jsonrpc: '2.0',
        id: data.id,
        error,
      })
    }
  } else {
    console.info('unknown message', data)
  }
}

const getIpc = async () => {
  const assetDir = Platform.getAssetDir()
  const urlRendererWorker = `${assetDir}/packages/renderer-worker/src/rendererWorkerMain.js`
  const rendererWorker = await WebWorker.create(urlRendererWorker)
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
  console.trace('send', method, params)
  state.ipc.send({
    jsonrpc: '2.0',
    method,
    params,
  })
}

export const sendAndTransfer = (message, transfer) => {
  state.ipc.sendAndTransfer(message, transfer)
}
