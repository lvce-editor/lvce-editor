export const findPreviousMatch = (lines, searchString, startRowIndex) => {
  for (let i = startRowIndex; i >= 0; i--) {
    const line = lines[i]
    const index = line.indexOf(searchString)
    if (index !== -1) {
      return {
        rowIndex: i,
        columnIndex: index,
      }
    }
  }
  return {
    rowIndex: 0,
    columnIndex: 0,
  }
}
