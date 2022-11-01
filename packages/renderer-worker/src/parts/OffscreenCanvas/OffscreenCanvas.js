import * as Callback from '../Callback/Callback.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const create = async () => {
  const offscreenCanvas = await new Promise(async (resolve, reject) => {
    const id = Callback.register(resolve, reject)
    await RendererProcess.invoke('OffscreenCanvas.create', id)
  })
  return offscreenCanvas
}
