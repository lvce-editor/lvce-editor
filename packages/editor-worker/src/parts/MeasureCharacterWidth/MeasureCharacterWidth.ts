import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'

export const measureCharacterWidth = (fontWeight, fontSize, fontFamily, letterSpacing) => {
  return MeasureTextWidth.measureTextWidth('a', fontWeight, fontSize, fontFamily, letterSpacing, false, 0)
}
