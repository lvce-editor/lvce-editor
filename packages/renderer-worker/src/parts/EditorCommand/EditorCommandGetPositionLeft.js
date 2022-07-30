export const editorGetPositionLeft = (
  rowIndex,
  columnIndex,
  lines,
  getDelta
) => {
  if (columnIndex === 0) {
    if (rowIndex === 0) {
      return { rowIndex: 0, columnIndex: 0 }
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

export const moveToPositionEqual = (selections, i, rowIndex, columnIndex) => {
  selections[i] = rowIndex
  selections[i + 1] = columnIndex
}

export const moveRangeToPosition = (selections, i, rowIndex, columnIndex) => {
  selections[i] = selections[i + 2] = rowIndex
  selections[i + 1] = selections[i + 3] = columnIndex
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
    if (rowIndex === 0) {
      selections[i] = 0
      selections[i + 1] = 0
    } else {
      selections[i] = rowIndex - 1
      selections[i + 1] = lines[rowIndex - 1].length
    }
  } else {
    const delta = getDelta(lines[rowIndex], columnIndex)
    selections[i] = rowIndex
    selections[i + 1] = columnIndex - delta
  }
}
