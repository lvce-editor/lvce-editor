import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

// TODO ask renderer process directly
export const measureTextHeight = (text: string, fontFamily: string, fontSize: number) => {
  return RendererWorker.invoke('MeasureTextHeight.measureTextHeight', text, fontFamily, fontSize)
}

export const measureTextBlockHeight = (text: string, fontFamily: string, fontSize: number, lineHeight: number | string, width: number) => {
  return RendererProcess.invoke('MeasureTextBlockHeight.measureTextBlockHeight', text, fontSize, fontFamily, lineHeight, width)
}
