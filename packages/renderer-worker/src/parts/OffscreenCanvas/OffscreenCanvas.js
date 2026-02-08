import * as Assert from '../Assert/Assert.ts'
import * as Id from '../Id/Id.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TerminalWorker from '../TerminalWorker/TerminalWorker.js'
import * as PreviewWorker from '../PreviewWorker/PreviewWorker.js'
import * as Transferrable from '../Transferrable/Transferrable.js'

export const create = async (canvasId) => {
  Assert.number(canvasId)
  const id = Id.create()
  await RendererProcess.invoke('OffscreenCanvas.create', canvasId, id)
  const canvas = Transferrable.acquire(id)
  return canvas
}
export const create2 = async (canvasId, width, height) => {
  Assert.number(canvasId)
  const id = Id.create()
  await RendererProcess.invoke('OffscreenCanvas.create2', canvasId, id, width, height)
  const canvas = Transferrable.acquire(id)
  return canvas
}

export const createForTerminal = async (canvasId, callbackId) => {
  const canvas = await create(canvasId)
  await TerminalWorker.invokeAndTransfer('OffscreenCanvas.handleResult', callbackId, canvas)
}

export const createForPreview = async (callbackId, width, height) => {
  const canvasId = Id.create()
  const canvas = await create2(canvasId, width, height)
  await PreviewWorker.invokeAndTransfer('Preview.executeCallback', callbackId, canvas, canvasId)
}
