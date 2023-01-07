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

export const measureTextWidth = (text, fontWeight, fontSize, fontFamily, letterSpacing) => {
  Assert.string(text)
  Assert.number(fontWeight)
  Assert.number(fontSize)
  Assert.string(fontFamily)
  if (typeof letterSpacing !== 'number' && typeof letterSpacing !== 'string') {
    throw new Error('letterSpacing must be of type number or of type string')
  }
  const ctx = getOrCreateCtx()
  // @ts-ignore
  ctx.letterSpacing = `${letterSpacing}px`
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  const metrics = ctx.measureText(text)
  return metrics.width
}
