import * as Character from '../Character/Character.ts'

const RE_WORD_START = /^\w+/

const RE_WORD_END = /\w+$/

export const getWordAt = (editor: any, rowIndex: number, columnIndex: number) => {
  const { lines } = editor
  const line = lines[rowIndex]
  const before = line.slice(0, columnIndex)
  const matchBefore = before.match(RE_WORD_END)
  const after = line.slice(columnIndex)
  const matchAfter = after.match(RE_WORD_START)
  let word = Character.EmptyString
  if (matchBefore) {
    word += matchBefore[0]
  }
  if (matchAfter) {
    word += matchAfter[0]
  }
  return {
    word,
  }
}

export const getWordBefore = (editor: any, rowIndex: number, columnIndex: number) => {
  const { lines } = editor
  const line = lines[rowIndex]
  const before = line.slice(0, columnIndex)
  const matchBefore = before.match(RE_WORD_END)
  if (matchBefore) {
    return matchBefore[0]
  }
  return Character.EmptyString
}
