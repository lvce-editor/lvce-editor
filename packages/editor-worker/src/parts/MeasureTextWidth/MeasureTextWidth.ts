import * as Assert from '../Assert/Assert.ts'
import * as GetTextMeasureContext from '../GetTextMeasureContext/GetTextMeasureContext.ts'
import * as GetFontString from '../GetFontString/GetFontString.ts'

const getLetterSpacingString = (letterSpacing) => {
  return `${letterSpacing}px`
}

export const measureTextWidth = (text, fontWeight, fontSize, fontFamily, letterSpacing, isMonoSpaceFont, charWidth) => {
  Assert.string(text)
  Assert.number(fontWeight)
  Assert.number(fontSize)
  Assert.string(fontFamily)
  Assert.boolean(isMonoSpaceFont)
  Assert.number(charWidth)
  if (isMonoSpaceFont) {
    return text.length * charWidth
  }
  if (typeof letterSpacing !== 'number') {
    throw new TypeError('letterSpacing must be of type number')
  }
  const letterSpacingString = getLetterSpacingString(letterSpacing)
  const fontString = GetFontString.getFontString(fontWeight, fontSize, fontFamily)
  const ctx = GetTextMeasureContext.getContext()
  // @ts-ignore
  ctx.letterSpacing = letterSpacingString
  ctx.font = fontString
  const metrics = ctx.measureText(text)
  const width = metrics.width
  return width
}
