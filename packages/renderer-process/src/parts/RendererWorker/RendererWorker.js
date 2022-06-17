import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as WebWorker from '../WebWorker/WebWorker.js'

// const URL_RENDERER_WORKER =
// '/packages/renderer-worker/distmin/rendererWorkerMain-0ead0bed.js'

export const state = {
  send(message) {},
  sendAndTransfer(message, transferables) {},
}

const handleMessageFromRendererWorker = (event) => {
  const data = event.data
  if (event.ports && event.ports.length > 0) {
    Command.execute(...data, ...event.ports)
  } else {
    Command.execute(...data)
  }
}

export const hydrate = async (config) => {
  const assetDir = Platform.getAssetDir()
  const urlRendererWorker = `${assetDir}/packages/renderer-worker/src/rendererWorkerMain.js`
  const rendererWorker = await WebWorker.create(urlRendererWorker)
  rendererWorker.onmessage = handleMessageFromRendererWorker
  state.send = (message) => {
    rendererWorker.postMessage(message)
  }
  state.sendAndTransfer = (message, transferables) => {
    rendererWorker.postMessage(message, transferables)
  }
}

// TODO needed?
export const dispose = () => {
  if (state.rendererWorker) {
    state.rendererWorker.terminate()
  }
}

export const send = (message) => {
  if (!message[0]) {
    console.warn('invalid message', message)
    return
  }
  state.send(message)
}

export const sendAndTransfer = (message, transfer) => {
  state.sendAndTransfer(message, transfer)
}

export const handleInvoke = async (callbackId, method, ...params) => {
  let result
  try {
    result = await Command.execute(method, ...params)
  } catch (error) {
    state.send([
      /* Callback.reject */ 67331,
      /* callbackId */ callbackId,
      /* error */ error,
    ])
    return
  }
  state.send([
    /* Callback.resolve */ 67330,
    /* callbackId */ callbackId,
    /* result */ result,
  ])
}
