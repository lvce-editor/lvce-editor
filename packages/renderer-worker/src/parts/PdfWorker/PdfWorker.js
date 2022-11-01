import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as PdfWorkerIpc from '../PdfWorkerIpc/PdfWorkerIpc.js'
import * as Callback from '../Callback/Callback.js'

const handleMessage = (message) => {
  if ('id' in message) {
    if ('result' in message) {
      Callback.resolve(message.id, message.result)
    } else if ('error' in message) {
      Callback.reject(message.id, new Error(message.error))
    }
  }
}

export const create = async () => {
  const ipc = await PdfWorkerIpc.create()
  ipc.onmessage = handleMessage
  return {
    send(message) {
      ipc.send(message)
    },
    sendAndTransfer(message, transfer) {
      ipc.sendAndTransfer(message, transfer)
    },
  }
}

export const invoke = (ipc, method, ...params) => {
  return new Promise((resolve, reject) => {
    const callbackId = Callback.register(resolve, reject)
    ipc.send({
      jsonrpc: JsonRpcVersion.Two,
      id: callbackId,
      method,
      params,
    })
  })
}

export const sendCanvas = (ipc, canvasId, offscreenCanvas) => {
  return new Promise((resolve, reject) => {
    const callbackId = Callback.register(resolve, reject)
    ipc.sendAndTransfer(
      {
        jsonrpc: JsonRpcVersion.Two,
        id: callbackId,
        method: 'Canvas.addCanvas',
        params: [canvasId, offscreenCanvas],
      },
      [offscreenCanvas]
    )
  })
}
