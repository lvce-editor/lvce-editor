/* number of lines in the textarea read by screen-reader, same as vscode */
const A11Y_PAGE_SIZE = 10

const countChars = (lines) => {
  let total = 0
  for (const line of lines) {
    total += line.length + 1
  }
  return total
}

const getScreenReaderInfo = (state) => {
  const rowIndex = state.cursor.rowIndex
  const columnIndex = state.cursor.columnIndex
  const lines = state.textDocument.lines
  const delta = rowIndex % A11Y_PAGE_SIZE
  const linesBefore = lines.slice(rowIndex - delta, rowIndex)
  // TODO lines[rowIndex] should always be defined
  let line = lines[rowIndex] || ''
  if (columnIndex > line.length) {
    line += ' '.repeat(columnIndex - line.length)
  }
  const linesAfter = lines.slice(
    rowIndex + 1,
    rowIndex - delta + A11Y_PAGE_SIZE
  )
  const selection = countChars(linesBefore) + columnIndex
  return {
    text: [...linesBefore, line, ...linesAfter].join('\n'),
    selectionStart: selection,
    selectionEnd: selection,
  }
}

// TODO this slows down rendering ~50% (extra style recalc & extra layout)
// TODO try to avoid extra style recalc & extra layout
// TODO possible have option to disable a11y rendering for better performance (however a11y should be enabled by default)
export const render = (state) => {
  const screenReaderInfo = getScreenReaderInfo(state)
  state.$EditorInput.value = screenReaderInfo.text
  state.$EditorInput.setSelectionRange(
    screenReaderInfo.selectionStart,
    screenReaderInfo.selectionEnd
  )
}
