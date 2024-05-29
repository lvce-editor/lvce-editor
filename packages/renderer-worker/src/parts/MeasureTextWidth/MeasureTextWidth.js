import * as Assert from '../Assert/Assert.ts'
import * as GetFontString from '../GetFontString/GetFontString.js'
import * as GetTextMeasureContext from '../GetTextMeasureContext/GetTextMeasureContext.js'
import * as Px from '../Px/Px.js'

const getLetterSpacingString = (letterSpacing) => {
  return Px.px(letterSpacing)
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
