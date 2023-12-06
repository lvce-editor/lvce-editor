import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const mock = () => {
  return RendererProcess.invoke('PointerCapture.mock')
}

export const unmock = () => {
  return RendererProcess.invoke('PointerCapture.unmock')
}
