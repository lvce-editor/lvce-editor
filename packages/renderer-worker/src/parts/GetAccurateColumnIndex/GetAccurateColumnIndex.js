import * as Assert from '../Assert/Assert.js'
import * as Character from '../Character/Character.js'
import * as IsAscii from '../IsAscii/IsAscii.js'
import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.js'
import * as NormalizeText from '../NormalizeText/NormalizeText.js'
import * as TextSegmenter from '../TextSegmenter/TextSegmenter.js'

const getAccurateColumnIndexAscii = (
  line,
  guess,
  averageCharWidth,
  eventX,
  fontWeight,
  fontSize,
  fontFamily,
  letterSpacing,
  isMonospaceFont,
  charWidth
) => {
  for (let i = guess; i < line.length; i++) {
    const width = MeasureTextWidth.measureTextWidth(line.slice(0, i), fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth)
    if (eventX - width < averageCharWidth / 2) {
      return i
    }
  }
  return line.length
}

const getAccurateColumnIndexUnicode = (line, guess, averageCharWidth, eventX, fontWeight, fontSize, fontFamily, letterSpacing) => {
  const segmenter = TextSegmenter.create()
  const segments = segmenter.getSegments(line)
  const isMonospaceFont = false
  const charWidth = 0
  for (const segment of segments) {
    const width = MeasureTextWidth.measureTextWidth(
      line.slice(0, segment.index),
      fontWeight,
      fontSize,
      fontFamily,
      letterSpacing,
      isMonospaceFont,
      charWidth
    )
    if (eventX - width < averageCharWidth) {
      return segment.index
    }
  }
  return line.length
}

const guessOffset = (eventX, averageCharWidth) => {
  const guess = Math.round(eventX / averageCharWidth)
  return guess
}

const normalizeGuess = (line, guess, tabSize) => {
  let normalizedGuess = guess
  for (let i = 0; i < guess; i++) {
    if (line[i] === Character.Tab) {
      normalizedGuess -= tabSize - 1
    }
  }
  return normalizedGuess
}

export const getAccurateColumnIndex = (line, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth, tabSize, eventX) => {
  Assert.string(line)
  Assert.number(fontWeight)
  Assert.number(fontSize)
  Assert.string(fontFamily)
  Assert.number(letterSpacing)
  Assert.boolean(isMonospaceFont)
  Assert.number(charWidth)
  Assert.number(tabSize)
  Assert.number(eventX)
  Assert.greaterZero(charWidth)
  const guess = guessOffset(eventX, charWidth)
  const normalize = NormalizeText.shouldNormalizeText(line)
  const normalizedGuess = normalizeGuess(line, guess, tabSize)
  const text = line.slice(0, normalizedGuess)
  const normalizedText = NormalizeText.normalizeText(text, normalize, tabSize)
  const actual = MeasureTextWidth.measureTextWidth(normalizedText, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth)
  const isAscii = IsAscii.isAscii(line)
  if (isAscii) {
    if (Math.abs(eventX - actual) < charWidth / 2) {
      return normalizedGuess
    }
    return getAccurateColumnIndexAscii(
      line,
      normalizedGuess,
      charWidth,
      eventX,
      fontWeight,
      fontSize,
      fontFamily,
      letterSpacing,
      isMonospaceFont,
      charWidth
    )
  }
  return getAccurateColumnIndexUnicode(line, normalizedGuess, charWidth, eventX, fontWeight, fontSize, fontFamily, letterSpacing)
}
