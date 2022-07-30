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
