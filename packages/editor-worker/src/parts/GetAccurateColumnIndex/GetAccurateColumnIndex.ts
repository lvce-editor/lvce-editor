import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.ts'
import * as GetAccurateColumnIndexAscii from '../GetAccurateColumnIndexAscii/GetAccurateColumnIndexAscii.ts'
import * as GetAccurateColumnIndexUnicode from '../GetAccurateColumnIndexUnicode/GetAccurateColumnIndexUnicode.ts'
import * as IsAscii from '../IsAscii/IsAscii.ts'
import * as MeasureTextWidth from '../MeasureTextWidth/MeasureTextWidth.ts'
import * as NormalizeText from '../NormalizeText/NormalizeText.ts'

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
    return GetAccurateColumnIndexAscii.getAccurateColumnIndexAscii(
      line,
      normalizedGuess,
      charWidth,
      eventX,
      fontWeight,
      fontSize,
      fontFamily,
      letterSpacing,
      isMonospaceFont,
      charWidth,
    )
  }
  return GetAccurateColumnIndexUnicode.getAccurateColumnIndexUnicode(
    line,
    normalizedGuess,
    charWidth,
    eventX,
    fontWeight,
    fontSize,
    fontFamily,
    letterSpacing,
  )
}
