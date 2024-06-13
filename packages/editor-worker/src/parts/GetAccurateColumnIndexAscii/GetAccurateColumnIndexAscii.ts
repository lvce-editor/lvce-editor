import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'

export const getAccurateColumnIndexAscii = (
  // @ts-ignore
  line,
  // @ts-ignore
  guess,
  // @ts-ignore
  averageCharWidth,
  // @ts-ignore
  eventX,
  // @ts-ignore
  fontWeight,
  // @ts-ignore
  fontSize,
  // @ts-ignore
  fontFamily,
  // @ts-ignore
  letterSpacing,
  // @ts-ignore
  isMonospaceFont,
  // @ts-ignore
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
