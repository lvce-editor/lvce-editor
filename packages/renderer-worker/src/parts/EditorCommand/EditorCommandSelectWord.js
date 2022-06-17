import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

// match all words, including umlauts, see https://stackoverflow.com/questions/5436824/matching-accented-characters-with-javascript-regexes/#answer-11550799
const RE_WORD_START = /^[a-z\u00C0-\u017F\d]+/i
const RE_WORD_END = /[a-z\u00C0-\u017F\d]+$/i

const getWordSelection = (line, rowIndex, columnIndex) => {
  const before = line.slice(0, columnIndex)
  const after = line.slice(columnIndex)
  const beforeMatch = before.match(RE_WORD_END)
  const afterMatch = after.match(RE_WORD_START)
  const columnStart = columnIndex - (beforeMatch ? beforeMatch[0].length : 0)
  const columnEnd = columnIndex + (afterMatch ? afterMatch[0].length : 0)
  const selection = {
    start: {
      rowIndex,
      columnIndex: columnStart,
    },
    end: {
      rowIndex,
      columnIndex: columnEnd,
    },
  }
  return selection
}

export const editorSelectWord = (editor, rowIndex, columnIndex) => {
  const line = TextDocument.getLine(editor, rowIndex)
  const selection = getWordSelection(line, rowIndex, columnIndex)
  const selectionEdits = [selection]
  return Editor.scheduleSelections(editor, selectionEdits)
}
