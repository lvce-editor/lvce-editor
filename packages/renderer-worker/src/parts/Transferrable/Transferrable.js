import * as Assert from '../Assert/Assert.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const objects = Object.create(null)

export const transferToRendererProcess = async (objectId, transferable) => {
  await RendererProcess.invokeAndTransfer('Transferrable.transfer', [transferable], objectId, transferable)
}

export const transfer = (objectId, transferable) => {
  Assert.number(objectId)
  Assert.object(transferable)
  objects[objectId] = transferable
}

export const acquire = (objectId) => {
  Assert.number(objectId)
  const value = objects[objectId]
  if (!value) {
    throw new Error(`transferrable object not found`)
  }
  delete objects[objectId]
  return value
}

export const transferToWebView = async (objectId) => {
  const portType = 'test'
  await RendererProcess.invoke('Transferrable.transferToWebView', objectId, portType)
}
