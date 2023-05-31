import * as MeasureTextWitdth from '../MeasureTextWidth/MeasureTextWidth.js'

export const measureTitleBarEntryWidth = (label, fontWeight, fontSize, fontFamily, letterSpacing) => {
  const isMonospaceFont = false
  const charWidth = 0
  return MeasureTextWitdth.measureTextWidth(label, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth)
}
