import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'

export const measureLongestLineWidth = (
  lines: any[],
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  letterSpacing: number,
  isMonoSpaceFont: boolean,
  charWidth: number,
) => {
  let longest = 0
  for (const line of lines) {
    const lineWidth = MeasureTextWidth.measureTextWidth(line, fontWeight, fontSize, fontFamily, letterSpacing, isMonoSpaceFont, charWidth)
    longest = Math.max(longest, lineWidth)
  }
  return longest
}
