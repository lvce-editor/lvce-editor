import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const state = {
  canvasObjects: Object.create(null),
}

export const get = (id) => {
  return state.canvasObjects[id]
}

export const create = (canvasId, callbackId) => {
  const canvas = document.createElement('canvas')
  // @ts-ignore
  const offscreenCanvas = canvas.transferControlToOffscreen()
  state.canvasObjects[canvasId] = canvas
  RendererWorker.sendAndTransfer(
    {
      jsonrpc: JsonRpcVersion.Two,
      id: callbackId,
      params: [offscreenCanvas],
    },
    [offscreenCanvas]
  )
}
