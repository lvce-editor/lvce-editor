import * as Assert from '../Assert/Assert.js'

export const state = {
  /**
   * @type {OffscreenCanvasRenderingContext2D|undefined|null}
   */
  ctx: undefined,
}

const getOrCreateCtx = () => {
  if (!state.ctx) {
    const canvas = new OffscreenCanvas(100, 100)
    const ctx = /** @type {OffscreenCanvasRenderingContext2D} */ (canvas.getContext('2d'))
    if (!ctx) {
      throw new Error(`Failed to get canvas context 2d`)
    }
    state.ctx = ctx
  }
  return state.ctx
}

export const measureTextWidth = (text, fontWeight, fontSize, fontFamily) => {
  Assert.string(text)
  Assert.number(fontWeight)
  Assert.number(fontSize)
  Assert.string(fontFamily)
  const ctx = getOrCreateCtx()
  // ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  ctx.font = `bold ${fontSize}px serif`
  const metrics = ctx.measureText(text)
  console.log(ctx.font, metrics.width)
  return metrics.width
}
