import * as Callback from '../Callback/Callback.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Assert from '../Assert/Assert.js'

export const create = async (canvasId) => {
  Assert.number(canvasId)
  const response = await new Promise(async (resolve, reject) => {
    const id = Callback.register(resolve, reject)
    await RendererProcess.invoke('OffscreenCanvas.create', canvasId, id)
  })
  const canvas = response.params[0]
  return canvas
}
