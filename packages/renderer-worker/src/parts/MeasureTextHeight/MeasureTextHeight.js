import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const measureTextHeight = (text, fontFamily, fontSize) => {
  return RendererProcess.invoke('MeasureTextHeight.measureTextHeight', text, fontFamily, fontSize)
}

export const measureTextBlockHeight = (text, fontFamily, fontSize, lineHeight, width) => {
  return RendererProcess.invoke('MeasureTextBlockHeight.measureTextBlockHeight', text, fontSize, fontFamily, lineHeight, width)
}
