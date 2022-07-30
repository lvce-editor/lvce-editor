export const editorGetPositionLeft = (
  selectionStartRow,
  selectionStartColumn,
  selectionEndRow,
  selectionEndColumn,
  lines,
  getDelta
) => {
  if (selectionEndColumn === 0) {
    if (selectionEndRow === 0) {
      return position
    }
    return {
      rowIndex: rowIndex - 1,
      columnIndex: lines[rowIndex - 1].length,
    }
  }
  const delta = getDelta(lines[rowIndex], columnIndex)
  return {
    rowIndex,
    columnIndex: columnIndex - delta,
  }
}

export const moveToPositionLeft = (
  selections,
  i,
  rowIndex,
  columnIndex,
  lines,
  getDelta
) => {
  if (columnIndex === 0) {
    selections[i] = selections[i + 2] = rowIndex - 1
    selections[i + 1] = selections[i + 3] = lines[rowIndex - 1].length
  } else {
    const delta = getDelta(lines[rowIndex], columnIndex)
    selections[i] = selections[i + 2] = rowIndex
    selections[i + 1] = selections[i + 3] = columnIndex - delta
  }
}
