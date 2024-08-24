import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const objects = Object.create(null)

export const transferToRendererProcess = async (objectId, transferable) => {
  await RendererProcess.invokeAndTransfer('Transferrable.transfer', [transferable], objectId, transferable)
}

export const transfer = (objectId, transferable) => {
  objects[objectId] = transferable
}

export const acquire = (objectId) => {
  const value = objects[objectId]
  delete objects[objectId]
  return value
}
