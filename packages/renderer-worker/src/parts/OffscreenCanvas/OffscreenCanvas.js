import * as Callback from '../Callback/Callback.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Assert from '../Assert/Assert.js'

export const create = async (canvasId) => {
  Assert.number(canvasId)
  const { id, promise } = Callback.registerPromise()
  await RendererProcess.invoke('OffscreenCanvas.create', canvasId, id)
  const response = await promise
  const canvas = response.params[0]
  return canvas
}
