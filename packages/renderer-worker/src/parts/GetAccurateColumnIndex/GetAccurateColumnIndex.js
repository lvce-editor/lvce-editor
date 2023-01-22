import * as IsAscii from '../IsAscii/IsAscii.js'
import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.js'
import * as TextSegmenter from '../TextSegmenter/TextSegmenter.js'

const getAccurateColumnIndexAscii = (line, guess, averageCharWidth, eventX, fontWeight, fontSize, fontFamily, letterSpacing) => {
  for (let i = guess; i < line.length; i++) {
    const width = MeasureTextWidth.measureTextWidth(line.slice(0, i), fontWeight, fontSize, fontFamily, letterSpacing)
    if (eventX - width < averageCharWidth / 2) {
      return i
    }
  }
  return line.length
}

const getAccurateColumnIndexUnicode = (line, guess, averageCharWidth, eventX, fontWeight, fontSize, fontFamily, letterSpacing) => {
  const segmenter = TextSegmenter.create()
  const segments = segmenter.getSegments(line)
  for (const segment of segments) {
    const width = MeasureTextWidth.measureTextWidth(line.slice(0, segment.index), fontWeight, fontSize, fontFamily, letterSpacing)
    if (eventX - width < averageCharWidth) {
      return segment.index
    }
  }
  return line.length
}

export const getAccurateColumnIndex = (line, fontWeight, fontSize, fontFamily, letterSpacing, eventX) => {
  const averageCharWidth = MeasureTextWidth.measureTextWidth('a', fontWeight, fontSize, fontFamily, letterSpacing)
  const guess = Math.round(eventX / averageCharWidth)
  const actual = MeasureTextWidth.measureTextWidth(line.slice(0, guess), fontWeight, fontSize, fontFamily, letterSpacing)
  const isAscii = IsAscii.isAscii(line)
  if (isAscii) {
    if (Math.abs(eventX - actual) < averageCharWidth / 2) {
      return guess
    }
    return getAccurateColumnIndexAscii(line, guess, averageCharWidth, eventX, fontWeight, fontSize, fontFamily, letterSpacing)
  }
  return getAccurateColumnIndexUnicode(line, guess, averageCharWidth, eventX, fontWeight, fontSize, fontFamily, letterSpacing)
}
