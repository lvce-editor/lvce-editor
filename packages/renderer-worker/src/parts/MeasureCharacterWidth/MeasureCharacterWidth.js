import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.js'

export const measureCharacterWidth = (fontWeight, fontSize, fontFamily, letterSpacing) => {
  return MeasureTextWidth.measureTextWidth('a', fontWeight, fontSize, fontFamily, letterSpacing, false, 0)
}
