import * as Editor from '../Editor/Editor.js'

// TODO handle virtual space

const getSelectionEditsSingleLineWord = (lines, word) => {
  const occurrences = []
  for (const [rowIndex, line] of lines.entries()) {
    let columnIndex = -word.length
    while (
      (columnIndex = line.indexOf(word, columnIndex + word.length)) !== -1
    ) {
      occurrences.push({
        start: {
          rowIndex,
          columnIndex,
        },
        end: {
          rowIndex,
          columnIndex: columnIndex + word.length,
        },
      })
    }
  }
  return occurrences
}

// selectAllOccurrencesSingleLine(['sample text, sample text'], 'sample') //?

const isMultiLineMatch = (lines, rowIndex, wordParts) => {
  let j = 0
  if (!lines[rowIndex + j].endsWith(wordParts[j])) {
    return false
  }
  while (++j < wordParts.length - 1) {
    if (lines[rowIndex + j] !== wordParts[j]) {
      return false
    }
  }
  // j--
  if (!lines[rowIndex + j].startsWith(wordParts[j])) {
    lines[rowIndex + j] // ?
    rowIndex + j // ?

    return false
  }
  return true
}

// TODO this is very expensive, there might be a better algorithm for this
// TODO if this matches the given selections, don't schedule selections/rerender
const getAllOccurrencesMultiLine = (lines, wordParts) => {
  const occurrences = []
  for (
    let rowIndex = 0;
    rowIndex < lines.length - wordParts.length + 1;
    rowIndex
  ) {
    lines
    rowIndex
    if (isMultiLineMatch(lines, rowIndex, wordParts)) {
      occurrences.push({
        start: {
          rowIndex,
          columnIndex: lines[rowIndex].length - wordParts[0].length,
        },
        end: {
          rowIndex: rowIndex + wordParts.length - 1,
          columnIndex: wordParts.at(-1).length,
        },
      })
      rowIndex += wordParts.length - 1
    } else {
      rowIndex++
    }
  }
  return occurrences
}

// TODO duplicate code with EditorSelectNextOccurrence
const RE_ALPHA_NUMERIC = /[a-zA-Z\d]/

const isAlphaNumeric = (char) => {
  return RE_ALPHA_NUMERIC.test(char)
}

const getWordStartIndex = (line, index) => {
  for (let i = index - 1; i >= 0; i--) {
    if (!isAlphaNumeric(line[i])) {
      return i + 1
    }
  }
  return 0
}

const getWordEndIndex = (line, index) => {
  for (let i = index; i < line.length; i++) {
    if (!isAlphaNumeric(line[i])) {
      return i
    }
  }
  return line.length - 1
}

const getWordMatchAtPosition = (lines, position) => {
  const line = lines[position.rowIndex]
  const index = position.columnIndex
  const start = getWordStartIndex(line, index)
  const end = getWordEndIndex(line, index)
  const word = line.slice(start, end)
  return {
    start,
    end,
    word,
  }
}

export const editorSelectAllOccurrences = (editor) => {
  // when there are no selections -> first selection is word -> find all selection that include word
  const lines = editor.lines
  if (Editor.hasSelection(editor)) {
    const lastSelection = editor.selections.at(-1)
    const startRowIndex = lastSelection.start.rowIndex
    const startColumnIndex = lastSelection.start.columnIndex
    const endRowIndex = lastSelection.end.rowIndex
    const endColumnIndex = lastSelection.end.columnIndex
    if (startRowIndex === endRowIndex) {
      const word = lines[startRowIndex].slice(startColumnIndex, endColumnIndex)
      const selectionEdits = getSelectionEditsSingleLineWord(lines, word)
      return Editor.scheduleSelections(editor, selectionEdits)
    }
    const wordParts = []
    wordParts.push(lines[startRowIndex].slice(startColumnIndex))
    for (let i = startRowIndex + 1; i < endRowIndex - 1; i++) {
      wordParts.push(lines[i])
    }
    wordParts.push(lines[endRowIndex].slice(0, endColumnIndex))
    const selectionEdits = getAllOccurrencesMultiLine(lines, wordParts)
    return Editor.scheduleSelections(editor, selectionEdits)
  }
  const wordMatch = getWordMatchAtPosition(editor.lines, editor.cursor)
  if (wordMatch.start === wordMatch.end) {
    return editor
  }
  const selectionEdits = getSelectionEditsSingleLineWord(lines, wordMatch.word)
  return Editor.scheduleSelections(editor, selectionEdits)
}
