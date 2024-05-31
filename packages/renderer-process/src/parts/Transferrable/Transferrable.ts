import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const state = {
  objects: Object.create(null),
}

export const transfer = (objectId, transferable) => {
  state.objects[objectId] = transferable
}

export const acquire = (objectId) => {
  const value = state.objects[objectId]
  delete state.objects[objectId]
  return value
}

export const transferToRendererWorker = (objectId, transferable) => {
  return RendererWorker.invokeAndTransfer('Transferrable.transfer', transferable, objectId)
}
