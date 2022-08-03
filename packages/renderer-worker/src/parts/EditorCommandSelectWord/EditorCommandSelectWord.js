import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

// match all words, including umlauts, see https://stackoverflow.com/questions/5436824/matching-accented-characters-with-javascript-regexes/#answer-11550799
const RE_WORD_START = /^[a-z\u00C0-\u017F\d]+/i
const RE_WORD_END = /[a-z\u00C0-\u017F\d]+$/i

const getNewSelections = (line, rowIndex, columnIndex) => {
  const before = line.slice(0, columnIndex)
  const after = line.slice(columnIndex)
  const beforeMatch = before.match(RE_WORD_END)
  const afterMatch = after.match(RE_WORD_START)
  const columnStart = columnIndex - (beforeMatch ? beforeMatch[0].length : 0)
  const columnEnd = columnIndex + (afterMatch ? afterMatch[0].length : 0)
  const newSelections = new Uint32Array([
    rowIndex,
    columnStart,
    rowIndex,
    columnEnd,
  ])
  return newSelections
}

export const editorSelectWord = (editor, rowIndex, columnIndex) => {
  const line = TextDocument.getLine(editor, rowIndex)
  const newSelections = getNewSelections(line, rowIndex, columnIndex)
  return Editor.scheduleSelections(editor, newSelections)
}
