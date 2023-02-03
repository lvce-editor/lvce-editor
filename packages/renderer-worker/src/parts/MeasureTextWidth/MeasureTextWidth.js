import * as Assert from '../Assert/Assert.js'
import * as MeasureTextWidthState from '../MeasureTextWidthState/MeasureTextWidthState.js'

const createCtx = () => {
  const canvas = new OffscreenCanvas(100, 100)
  const ctx = /** @type {OffscreenCanvasRenderingContext2D} */ (canvas.getContext('2d'))
  if (!ctx) {
    throw new Error(`Failed to get canvas context 2d`)
  }
  return ctx
}

const getLetterSpacingString = (letterSpacing) => {
  if (typeof letterSpacing === 'string') {
    return letterSpacing
  }
  return `${letterSpacing}px`
}

const getFontString = (fontWeight, fontSize, fontFamily) => {
  return `${fontWeight} ${fontSize}px ${fontFamily}`
}

export const measureTextWidth = (text, fontWeight, fontSize, fontFamily, letterSpacing) => {
  Assert.string(text)
  Assert.number(fontWeight)
  Assert.number(fontSize)
  Assert.string(fontFamily)
  if (typeof letterSpacing !== 'number' && typeof letterSpacing !== 'string') {
    throw new Error('letterSpacing must be of type number or of type string')
  }
  const letterSpacingString = getLetterSpacingString(letterSpacing)
  const fontString = getFontString(fontWeight, fontSize, fontFamily)
  const ctx = MeasureTextWidthState.getOrCreate(createCtx)
  // @ts-ignore
  ctx.letterSpacing = letterSpacingString
  ctx.font = fontString
  const metrics = ctx.measureText(text)
  return metrics.width
}
