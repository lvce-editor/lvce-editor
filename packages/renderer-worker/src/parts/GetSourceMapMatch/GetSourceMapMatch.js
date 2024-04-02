import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.js'
import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'

const RE_SOURCE_MAP = /^\/\/# sourceMappingURL=(.*)$/

export const getSourceMapMatch = (text) => {
  Assert.string(text)
  const index = text.lastIndexOf(Character.NewLine, text.length - 2)
  const lastLine = text.slice(index + 1, -1)
  const lastLineMatch = lastLine.match(RE_SOURCE_MAP)
  if (lastLineMatch) {
    return lastLineMatch
  }
  const secondLastLineIndex = GetNewLineIndex.getNewLineIndex(text, index - 1)
  const secondLastLine = text.slice(secondLastLineIndex, index)
  const secondLastLineMatch = secondLastLine.match(RE_SOURCE_MAP)
  return secondLastLineMatch
}
