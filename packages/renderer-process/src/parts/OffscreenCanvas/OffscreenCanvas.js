import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const state = {
  canvasObjects: Object.create(null),
}

export const get = (id) => {
  return state.canvasObjects[id]
}

export const create = () => {
  const canvas = document.createElement('canvas')
  console.log({ canvas })
  // @ts-ignore
  const offscreenCanvas = canvas.transferControlToOffscreen()
  RendererWorker.sendAndTransfer(
    {
      jsonrpc: '2.0',
      method: 'setOffscreenCanvas',
      params: [offscreenCanvas],
    },
    [offscreenCanvas]
  )
  console.log({ offscreenCanvas })
  return 123
}
