import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'

export const measureCharacterWidth = (fontWeight: number, fontSize: number, fontFamily: string, letterSpacing: number) => {
  return MeasureTextWidth.measureTextWidth('a', fontWeight, fontSize, fontFamily, letterSpacing, false, 0)
}
