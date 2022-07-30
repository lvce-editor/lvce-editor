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

export const clone = (selections) => {
  return new Uint32Array(selections.length)
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

export const moveRangeToPosition = (selections, i, rowIndex, columnIndex) => {
  selections[i] = selections[i + 2] = rowIndex
  selections[i + 1] = selections[i + 3] = columnIndex
}
