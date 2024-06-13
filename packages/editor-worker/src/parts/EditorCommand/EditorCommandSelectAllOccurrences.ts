// @ts-ignore
import * as Editor from '../Editor/Editor.ts'

// TODO handle virtual space

// @ts-ignore
const getNewSelectionsSingleLineWord = (lines, word) => {
  if (word.length === 0) {
    throw new Error('word length must be greater than zero')
  }
  const newSelections: number[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let columnIndex = -word.length
    while ((columnIndex = line.indexOf(word, columnIndex + word.length)) !== -1) {
      newSelections.push(i, columnIndex, i, columnIndex + word.length)
    }
  }
  return new Uint32Array(newSelections)
}

// @ts-ignore
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
// @ts-ignore
const getAllOccurrencesMultiLine = (lines, wordParts) => {
  const newSelections: any[] = []
  for (let rowIndex = 0; rowIndex < lines.length - wordParts.length + 1; rowIndex) {
    lines
    rowIndex
    if (isMultiLineMatch(lines, rowIndex, wordParts)) {
      newSelections.push(rowIndex, lines[rowIndex].length - wordParts[0].length, rowIndex + wordParts.length - 1, wordParts.at(-1).length)
      rowIndex += wordParts.length - 1
    } else {
      rowIndex++
    }
  }
  return new Uint32Array(newSelections)
}

// TODO duplicate code with EditorSelectNextOccurrence
const RE_ALPHA_NUMERIC = /[a-zA-Z\d]/

// @ts-ignore
const isAlphaNumeric = (char) => {
  return RE_ALPHA_NUMERIC.test(char)
}

// @ts-ignore
const getWordStartIndex = (line, index) => {
  for (let i = index - 1; i >= 0; i--) {
    if (!isAlphaNumeric(line[i])) {
      return i + 1
    }
  }
  return 0
}

// @ts-ignore
const getWordEndIndex = (line, index) => {
  for (let i = index; i < line.length; i++) {
    if (!isAlphaNumeric(line[i])) {
      return i
    }
  }
  return line.length - 1
}

// @ts-ignore
const getWordMatchAtPosition = (lines, rowIndex, columnIndex) => {
  const line = lines[rowIndex]
  const start = getWordStartIndex(line, columnIndex)
  const end = getWordEndIndex(line, columnIndex)
  const word = line.slice(start, end)
  return {
    start,
    end,
    word,
  }
}

// @ts-ignore
const getNewSelections = (lines, selections) => {
  if (selections.length < 4) {
    throw new Error('selections must have at least one entry')
  }
  const firstSelectionIndex = 0
  const startRowIndex = selections[firstSelectionIndex]
  const startColumnIndex = selections[firstSelectionIndex + 1]
  const endRowIndex = selections[firstSelectionIndex + 2]
  const endColumnIndex = selections[firstSelectionIndex + 3]
  if (startRowIndex === endRowIndex) {
    if (startColumnIndex === endColumnIndex) {
      const wordMatch = getWordMatchAtPosition(lines, endRowIndex, endColumnIndex)
      if (wordMatch.start === wordMatch.end) {
        return selections
      }
      const newSelections = getNewSelectionsSingleLineWord(lines, wordMatch.word)
      return newSelections
    }
    const line = lines[startRowIndex]
    const word = line.slice(startColumnIndex, endColumnIndex)
    const newSelections = getNewSelectionsSingleLineWord(lines, word)
    return newSelections
  }
  const wordParts: string[] = []
  wordParts.push(lines[startRowIndex].slice(startColumnIndex))
  for (let i = startRowIndex + 1; i < endRowIndex - 1; i++) {
    wordParts.push(lines[i])
  }
  wordParts.push(lines[endRowIndex].slice(0, endColumnIndex))
  const newSelections = getAllOccurrencesMultiLine(lines, wordParts)
  return newSelections
}

// @ts-ignore
export const selectAllOccurrences = (editor) => {
  // when there are no selections -> first selection is word -> find all selection that include word
  const lines = editor.lines
  const selections = editor.selections
  const newSelections = getNewSelections(lines, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
