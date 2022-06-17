export const editorGetPositionLeft = (position, lines, getDelta) => {
  const rowIndex = position.rowIndex
  const columnIndex = position.columnIndex
  if (columnIndex === 0) {
    if (rowIndex === 0) {
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
