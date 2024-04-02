import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Assert from '../Assert/Assert.ts'

export const getUserMedia = async (captureId, options) => {
  Assert.number(captureId)
  Assert.object(options)
  await RendererProcess.invoke('ScreenCapture.start', captureId, options)
}

export const dispose = async (captureId) => {
  Assert.number(captureId)
  await RendererProcess.invoke('ScreenCapture.dispose', captureId)
}
