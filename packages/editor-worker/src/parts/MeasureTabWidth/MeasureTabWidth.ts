import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'

export const measureTabWidth = (label, fontWeight, fontSize, fontFamily, letterSpacing) => {
  const isMonospaceFont = false
  const charWidth = 0
  const width = MeasureTextWidth.measureTextWidth(label, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth)
  const padding = 5
  const fileIconWidth = 16
  const fileIconGap = 4
  const closeButtonWidth = 23
  const closeButtonGap = 4
  const tabWidth = width + padding * 2 + fileIconWidth + fileIconGap + closeButtonWidth + closeButtonGap
  const tabWidthInt = Math.ceil(tabWidth)
  return tabWidthInt
}
