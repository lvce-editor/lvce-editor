import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const measureTextHeight = (text, fontFamily, fontSize) => {
  return RendererWorker.invoke('MeasureTextHeight.measureTextHeight', text, fontFamily, fontSize)
}
