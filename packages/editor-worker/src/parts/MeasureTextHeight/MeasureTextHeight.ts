import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

// TODO ask renderer process directly
export const measureTextHeight = (text: string, fontFamily: string, fontSize: number) => {
  return RendererWorker.invoke('MeasureTextHeight.measureTextHeight', text, fontFamily, fontSize)
}

export const measureTextBlockHeight = (text: string, fontFamily: string, fontSize: number, lineHeight: number | string, width: number) => {
  return RendererWorker.invoke('MeasureTextBlockHeight.measureTextBlockHeight', text, fontSize, fontFamily, lineHeight, width)
}
