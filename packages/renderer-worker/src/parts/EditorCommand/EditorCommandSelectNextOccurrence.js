import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

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
  const lastSelection = selections.at(-1)
  const rowIndex = lastSelection.start.rowIndex
  const word = lines[rowIndex].slice(
    lastSelection.start.columnIndex,
    lastSelection.end.columnIndex
  )
  const columnIndexAfter = lines[rowIndex].indexOf(
    word,
    lastSelection.end.columnIndex
  )
  if (columnIndexAfter !== -1) {
    const revealRange = {
      start: {
        rowIndex,
        columnIndex: columnIndexAfter,
      },
      end: {
        rowIndex,
        columnIndex: columnIndexAfter + word.length,
      },
    }
    return {
      revealRange,
      selectionEdits: [...selections, revealRange],
    }
  }
  for (let i = rowIndex + 1; i < lines.length; i++) {
    const columnIndex = lines[i].indexOf(word)
    if (columnIndex !== -1) {
      const revealRange = {
        start: {
          rowIndex: i,
          columnIndex,
        },
        end: {
          rowIndex: i,
          columnIndex: columnIndex + word.length,
        },
      }
      return {
        revealRange,
        selectionEdits: [...selections, revealRange],
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
      const revealRange = {
        start: {
          rowIndex: i,
          columnIndex,
        },
        end: {
          rowIndex: i,
          columnIndex: columnIndex + word.length,
        },
      }
      return {
        revealRange,
        selectionEdits: [
          ...selections.slice(0, selectionIndex),
          revealRange,
          ...selections.slice(selectionIndex),
        ],
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

// const

const isEmpty = (selection) => {
  return selection.start === selection.end
}

const getNextMatch = () => {}

const isSingleLine = (selection) => {
  return selection.start.rowIndex === selection.end.rowIndex
}

const getSelectNextOccurrenceResult = (editor) => {
  if (editor.selections.every(isEmpty)) {
    const selectionEdits = []
    for (const selection of editor.selections) {
      const wordMatch = getWordMatchAtPosition(editor.lines, selection.start)
      if (wordMatch.start === wordMatch.end) {
        selectionEdits.push(selection)
      } else {
        selectionEdits.push({
          start: {
            rowIndex: selection.start.rowIndex,
            columnIndex: wordMatch.start,
          },
          end: {
            rowIndex: selection.start.rowIndex,
            columnIndex: wordMatch.end,
          },
        })
      }
    }
    return {
      selectionEdits,
      revealRange: selectionEdits.at(-1), // TODO should be primary selection
    }
  }

  if (editor.selections.every(isSingleLine)) {
    return getSelectionEditsSingleLineWord(editor.lines, editor.selections)
  }
  return undefined
}

const isRangeInViewPort = (editor, range) => {
  return (
    range.start.rowIndex >= editor.minLineY &&
    range.end.rowIndex <= editor.maxLineY
  )
}

// TODO handle virtual space
export const editorSelectNextOccurrence = (editor) => {
  const result = getSelectNextOccurrenceResult(editor)
  if (!result) {
    return editor
  }
  const revealRange = result.revealRange
  const selectionEdits = result.selectionEdits
  if (isRangeInViewPort(editor, revealRange)) {
    return Editor.scheduleSelections(editor, selectionEdits)
  }
    const deltaY = (revealRange.start.rowIndex - 5) * editor.rowHeight
    return Editor.scheduleSelectionsAndScrollPosition(
      editor,
      selectionEdits,
      deltaY
    )

}
