import * as Assert from '../Assert/Assert.js'
import * as Callback from '../Callback/Callback.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as TerminalWorker from '../TerminalWorker/TerminalWorker.js'

export const create = async (canvasId) => {
  Assert.number(canvasId)
  const { id, promise } = Callback.registerPromise()
  await RendererProcess.invoke('OffscreenCanvas.create', canvasId, id)
  const response = await promise
  const canvas = response.params[0]
  return canvas
}

export const createForTerminal = async (canvasId, callbackId) => {
  const canvas = await create(canvasId)
  await TerminalWorker.invokeAndTransfer([canvas], 'OffscreenCanvas.handleResult', callbackId, canvas)
}
