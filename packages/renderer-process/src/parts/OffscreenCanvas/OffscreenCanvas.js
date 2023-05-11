import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as OffscreenCanvasState from '../OffscreenCanvasState/OffscreenCanvasState.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const get = (id) => {
  return OffscreenCanvasState.get(id)
}

export const create = (canvasId, callbackId) => {
  const canvas = document.createElement('canvas')
  // @ts-ignore
  const offscreenCanvas = canvas.transferControlToOffscreen()
  OffscreenCanvasState.set(canvasId, canvas)
  RendererWorker.sendAndTransfer(
    {
      jsonrpc: JsonRpcVersion.Two,
      id: callbackId,
      params: [offscreenCanvas],
    },
    [offscreenCanvas]
  )
}
