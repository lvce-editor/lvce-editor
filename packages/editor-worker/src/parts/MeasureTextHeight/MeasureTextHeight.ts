import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const measureTextHeight = (text: string, fontFamily: string, fontSize: number) => {
  return RendererWorker.invoke('MeasureTextHeight.measureTextHeight', text, fontFamily, fontSize)
}
