import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.js'

export const getAccurateColumnIndexAscii = (
  line,
  guess,
  averageCharWidth,
  eventX,
  fontWeight,
  fontSize,
  fontFamily,
  letterSpacing,
  isMonospaceFont,
  charWidth,
) => {
  for (let i = guess; i < line.length; i++) {
    const width = MeasureTextWidth.measureTextWidth(line.slice(0, i), fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth)
    if (eventX - width < averageCharWidth / 2) {
      return i
    }
  }
  return line.length
}
