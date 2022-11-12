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
  const line = lines[rowIndex]
  if (columnIndex >= line.length) {
    selections[i] = selections[i + 2] = rowIndex + 1
    selections[i + 1] = selections[i + 3] = 0
  } else {
    const delta = getDelta(line, columnIndex)
    selections[i] = selections[i + 2] = rowIndex
    selections[i + 1] = selections[i + 3] = columnIndex + delta
  }
}
