export const fromRange = (
  startRowIndex,
  startColumnIndex,
  endRowIndex,
  endColumnIndex
) => {
  return new Uint32Array([
    startRowIndex,
    startColumnIndex,
    endRowIndex,
    endColumnIndex,
  ])
}

export const fromPosition = (rowIndex, columnIndex) => {
  return fromRange(rowIndex, columnIndex, rowIndex, columnIndex)
}

export const alloc = (length) => {
  return new Uint32Array(length)
}

export const clone = (selections) => {
  return alloc(selections.length)
}

export const map = (selections, fn) => {
  const newSelections = clone(selections)
  for (let i = 0; i < newSelections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    fn(
      newSelections,
      i,
      selectionStartRow,
      selectionStartColumn,
      selectionEndRow,
      selectionEndColumn
    )
  }
  return newSelections
}

export const forEach = (selections, fn) => {
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    fn(
      selectionStartRow,
      selectionStartColumn,
      selectionEndRow,
      selectionEndColumn
    )
  }
}

export const moveRangeToPosition = (selections, i, rowIndex, columnIndex) => {
  selections[i] = selections[i + 2] = rowIndex
  selections[i + 1] = selections[i + 3] = columnIndex
}

const isSelectionEmpty = (
  selectionStartRow,
  selectionStartColumn,
  selectionEndRow,
  selectionEndColumn
) => {
  return (
    selectionStartRow === selectionEndRow &&
    selectionStartColumn === selectionEndColumn
  )
}

export const isEverySelectionEmpty = (selections) => {
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (
      !isSelectionEmpty(
        selectionStartRow,
        selectionStartColumn,
        selectionEndRow,
        selectionEndColumn
      )
    ) {
      return false
    }
  }
  return true
}

export const from = (array, getSelection) => {
  const newSelections = alloc(array.length * 4)
  let i = 0
  for (const item of array) {
    const { start, end } = getSelection(item)
    newSelections[i++] = start.rowIndex
    newSelections[i++] = start.columnIndex
    newSelections[i++] = end.rowIndex
    newSelections[i++] = end.columnIndex
  }
  console.log({ newSelections })
  return newSelections
}
