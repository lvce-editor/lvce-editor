import * as MeasureTextWidthState from '../MeasureTextWidthState/MeasureTextWidthState.js'

const createCtx = () => {
  const canvas = new OffscreenCanvas(0, 0)
  const ctx = /** @type {OffscreenCanvasRenderingContext2D} */ (canvas.getContext('2d'))
  if (!ctx) {
    throw new Error('Failed to get canvas context 2d')
  }
  return ctx
}

export const getContext = () => {
  const ctx = MeasureTextWidthState.getOrCreate(createCtx)
  return ctx
}
