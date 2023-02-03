import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.js'

export const measureTotalTextWidth = (items, fontWeight, fontSize, fontFamily, letterSpacing) => {
  let total = 0
  for (const item of items) {
    const textWidth = MeasureTextWidth.measureTextWidth(item, fontWeight, fontSize, fontFamily, letterSpacing)
    total += textWidth
  }
  return total
}
