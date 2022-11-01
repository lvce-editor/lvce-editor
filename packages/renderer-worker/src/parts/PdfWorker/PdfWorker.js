import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as PdfWorkerIpc from '../PdfWorkerIpc/PdfWorkerIpc.js'

export const create = async () => {
  const ipc = await PdfWorkerIpc.create()
  return {
    send(message) {
      ipc.send(message)
    },
    sendCanvas(canvasId, offscreenCanvas, content) {
      ipc.sendAndTransfer(
        {
          jsonrpc: JsonRpcVersion.Two,
          method: 'Canvas.addCanvas',
          params: [canvasId, offscreenCanvas, content],
        },
        [offscreenCanvas]
      )
    },
  }
}

export const invoke = async (ipc, method, ...params) => {
  ipc.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
  })
}
