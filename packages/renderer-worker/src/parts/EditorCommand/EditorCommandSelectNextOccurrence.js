import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
// TODO handle virtual space

// TODO editors behave differently when selecting next occurrence, for example:

// aaa
// bbb 1
// ccc
// bbb 2
// bbb 3
// aaa
// bbb 4
// ccc

// when clicking first at position 4 and then position 2,
// - vscode selects next position 3 and refuses to select position 1
// - atom also selects next position 3 and refuses to select position 1
// - WebStorm also selects next position 3 and refuses to select position 1
// - brackets (codemirror) selects position 3 and then selects position 1
// - sublime selects next position 1, then next position 3

const isBetween = (value, min, max) => {
  return min <= value && value <= max
}

const getSelectionEditsSingleLineWord = (lines, selections) => {
  const lastSelectionIndex = selections.length - 4
  const rowIndex = selections[lastSelectionIndex]
  const lastSelectionStartColumnIndex = selections[lastSelectionIndex + 1]
  const lastSelectionEndColumnIndex = selections[lastSelectionIndex + 3]
  const line = lines[rowIndex]
  const word = line.slice(
    lastSelectionStartColumnIndex,
    lastSelectionEndColumnIndex
  )
  const columnIndexAfter = line.indexOf(word, lastSelectionEndColumnIndex)
  if (columnIndexAfter !== -1) {
    const columnIndexAfterEnd = columnIndexAfter + word.length
    const revealRange = {
      start: {
        rowIndex,
        columnIndex: columnIndexAfter,
      },
      end: {
        rowIndex,
        columnIndex: columnIndexAfterEnd,
      },
    }
    const newSelections = EditorSelection.push(
      selections,
      rowIndex,
      columnIndexAfter,
      rowIndex,
      columnIndexAfterEnd
    )
    return {
      revealRange: newSelections.length - 4,
      selectionEdits: newSelections,
    }
  }
  for (let i = rowIndex + 1; i < lines.length; i++) {
    const line = lines[i]
    const columnIndex = line.indexOf(word)
    if (columnIndex !== -1) {
      const columnIndexEnd = columnIndex + word.length
      const revealRange = {
        start: {
          rowIndex: i,
          columnIndex,
        },
        end: {
          rowIndex: i,
          columnIndex: columnIndexEnd,
        },
      }
      const newSelections = EditorSelection.push(
        selections,
        i,
        columnIndex,
        i,
        columnIndexEnd
      )
      return {
        revealRange: newSelections.length - 4,
        selectionEdits: newSelections,
      }
    }
  }
  let selectionIndex = 0
  let selection = selections[selectionIndex]
  for (let i = 0; i <= rowIndex; i++) {
    const line = lines[i]
    let columnIndex = -word.length
    while (
      (columnIndex = line.indexOf(word, columnIndex + word.length)) !== -1
    ) {
      while (
        selection.start.rowIndex < i &&
        selectionIndex < selections.length
      ) {
        selection = selections[selectionIndex++]
      }
      if (selection.start.rowIndex === i) {
        while (
          selection.end.columnIndex < columnIndex &&
          selectionIndex < selections.length
        ) {
          selection = selections[selectionIndex++]
        }
      }
      if (
        selection.start.rowIndex === i &&
        selection.start.columnIndex <= columnIndex &&
        columnIndex <= selection.end.columnIndex
      ) {
        continue
      }
      if (selection.start.rowIndex > i) {
        selectionIndex--
      }
      const columnEndIndex = columnIndex + word.length
      const revealRange = {
        start: {
          rowIndex: i,
          columnIndex,
        },
        end: {
          rowIndex: i,
          columnIndex: columnEndIndex,
        },
      }
      const newSelections = EditorSelection.alloc(selections.length + 1)
      newSelections.set(selections.subarray(0, selectionIndex * 4), 0)
      newSelections[selectionIndex * 4] = i
      newSelections[selectionIndex * 4 + 1] = columnIndex
      newSelections[selectionIndex * 4 + 2] = i
      newSelections[selectionIndex * 4 + 3] = columnEndIndex
      newSelections.set(
        selections.subarray(selectionIndex * 4),
        selectionIndex * 4 + 4
      )

      return {
        revealRange,
        selectionEdits: newSelections,
      }
    }
  }
  return undefined
}

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

const getWordMatchAtPosition = (lines, rowIndex, columnIndex) => {
  const line = lines[rowIndex]
  const index = columnIndex
  const start = getWordStartIndex(line, index)
  const end = getWordEndIndex(line, index)
  const word = line.slice(start, end)
  return {
    start,
    end,
    word,
  }
}

const getSelectNextOccurrenceResult = (editor) => {
  const lines = editor.lines
  const selections = editor.selections
  if (EditorSelection.isEverySelectionEmpty(selections)) {
    const newSelections = EditorSelection.alloc(selections.length)
    for (let i = 0; i < selections.length; i += 4) {
      const startRowIndex = selections[i]
      const startColumnIndex = selections[i + 1]
      const endRowIndex = selections[i + 2]
      const endColumnIndex = selections[i + 3]

      const wordMatch = getWordMatchAtPosition(
        lines,
        startRowIndex,
        startColumnIndex
      )
      if (wordMatch.start === wordMatch.end) {
        newSelections[i] = startRowIndex
        newSelections[i + 1] = startColumnIndex
        newSelections[i + 2] = endRowIndex
        newSelections[i + 3] = endColumnIndex
      } else {
        newSelections[i] = startRowIndex
        newSelections[i + 1] = wordMatch.start
        newSelections[i + 2] = startRowIndex
        newSelections[i + 3] = wordMatch.end
      }
    }

    return {
      selectionEdits: newSelections,
      revealRange: newSelections.length - 4, // TODO should be primary selection
    }
  }

  if (EditorSelection.isEverySelectionEmpty(editor.selections)) {
    return getSelectionEditsSingleLineWord(editor.lines, editor.selections)
  }
  return undefined
}

const isRangeInViewPort = (minLineY, maxLineY, startRowIndex, endRowIndex) => {
  return startRowIndex >= minLineY && endRowIndex <= maxLineY
}

// TODO handle virtual space
export const editorSelectNextOccurrence = (editor) => {
  const result = getSelectNextOccurrenceResult(editor)
  if (!result) {
    return editor
  }
  const revealRange = result.revealRange
  const selectionEdits = result.selectionEdits
  const revealRangeStartRowIndex = selectionEdits[revealRange]
  const revealRangeEndRowIndex = selectionEdits[revealRange + 2]
  if (
    isRangeInViewPort(
      editor.minLineY,
      editor.maxLineY,
      revealRangeStartRowIndex,
      revealRangeEndRowIndex
    )
  ) {
    return Editor.scheduleSelections(editor, selectionEdits)
  }
  const deltaY = (revealRangeStartRowIndex - 5) * editor.rowHeight
  return Editor.scheduleSelectionsAndScrollPosition(
    editor,
    selectionEdits,
    deltaY
  )
}
