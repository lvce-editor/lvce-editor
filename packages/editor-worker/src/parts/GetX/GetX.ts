import * as Assert from '../Assert/Assert.ts'
import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'
import * as NormalizeText from '../NormalizeText/NormalizeText.ts'

// TODO visible selections could also be uint16array
// [top1, left1, width1, height1, top2, left2, width2, height2...]
const getTabCount = (string: string) => {
  let count = 0
  for (const element of string) {
    if (element === '\t') {
      count++
    }
  }
  return count
}

export const getX = (
  line: string,
  column: number,
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  isMonospaceFont: boolean,
  letterSpacing: number,
  tabSize: number,
  halfCursorWidth: number,
  width: number,
  averageCharWidth: number,
  difference = 0,
) => {
  if (!line) {
    return 0
  }
  Assert.string(line)
  Assert.number(tabSize)
  Assert.number(halfCursorWidth)
  Assert.number(width)
  Assert.boolean(isMonospaceFont)
  Assert.number(averageCharWidth)
  Assert.number(difference)
  if (column === 0) {
    return 0
  }
  // TODO support non-monospace font, emoji, tab character, zero width characters
  if (column * averageCharWidth > width) {
    return width
  }
  const normalize = NormalizeText.shouldNormalizeText(line)
  const normalizedLine = NormalizeText.normalizeText(line, normalize, tabSize)
  const tabCount = getTabCount(line.slice(0, column))
  const partialText = normalizedLine.slice(0, column + tabCount)
  return (
    MeasureTextWidth.measureTextWidth(partialText, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, averageCharWidth) -
    halfCursorWidth +
    difference
  )
}

export const getY = (row: number, minLineY: number, rowHeight: number) => {
  return (row - minLineY) * rowHeight
}
