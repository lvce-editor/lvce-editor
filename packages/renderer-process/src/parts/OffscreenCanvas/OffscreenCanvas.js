import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const state = {
  canvasObjects: Object.create(null),
}

export const get = (id) => {
  return state.canvasObjects[id]
}

export const create = (id) => {
  const canvas = document.createElement('canvas')
  // @ts-ignore
  const offscreenCanvas = canvas.transferControlToOffscreen()
  RendererWorker.sendAndTransfer(
    {
      jsonrpc: '2.0',
      id,
      params: [offscreenCanvas],
    },
    [offscreenCanvas]
  )
}
