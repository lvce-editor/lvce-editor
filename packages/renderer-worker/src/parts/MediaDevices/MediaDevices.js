import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Assert from '../Assert/Assert.js'

export const getUserMedia = async (options) => {
  Assert.object(options)
  await RendererProcess.invoke('ScreenCapture.start', options)
}
