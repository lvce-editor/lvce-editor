import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const measureTextHeight = (text, fontFamily, fontSize) => {
  return RendererWorker.invoke('MeasureTextHeight.measureTextHeight', text, fontFamily, fontSize)
}