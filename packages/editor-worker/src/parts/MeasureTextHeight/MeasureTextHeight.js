import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const measureTextHeight = (text, fontFamily, fontSize) => {
  return RendererProcess.invoke('MeasureTextHeight.measureTextHeight', text, fontFamily, fontSize)
}
