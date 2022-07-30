export const editorGetPositionRight = (position, lines, getDelta) => {
  const rowIndex = position.rowIndex
  const columnIndex = position.columnIndex
  if (columnIndex >= lines[rowIndex].length) {
    if (rowIndex >= lines.length) {
      return position
    }
    return {
      rowIndex: rowIndex + 1,
      columnIndex: 0,
    }
  }
  const delta = getDelta(lines[rowIndex], columnIndex)
  return {
    rowIndex,
    columnIndex: columnIndex + delta,
  }
}

export const moveToPositionRight = (
  selections,
  i,
  rowIndex,
  columnIndex,
  lines,
  getDelta
) => {
  if (columnIndex >= lines[rowIndex.length]) {
    selections[i] = selections[i + 2] = selections[i] + 1
    selections[i + 1] = selections[i + 3] = 0
  } else {
    const delta = getDelta(lines[rowIndex], columnIndex)
    selections[i] = selections[i + 2] = rowIndex
    selections[i + 1] = selections[i + 3] = columnIndex + delta
  }
}
