import * as Assert from '../Assert/Assert.js'
import * as GetTextMeasureContext from '../GetTextMeasureContext/GetTextMeasureContext.js'

const getLetterSpacingString = (letterSpacing) => {
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
  if (typeof letterSpacing !== 'number') {
    throw new Error('letterSpacing must be of type number')
  }
  const letterSpacingString = getLetterSpacingString(letterSpacing)
  const fontString = getFontString(fontWeight, fontSize, fontFamily)
  const ctx = GetTextMeasureContext.getContext()
  // @ts-ignore
  ctx.letterSpacing = letterSpacingString
  ctx.font = fontString
  const metrics = ctx.measureText(text)
  const width = metrics.width
  return width
}
