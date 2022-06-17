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
