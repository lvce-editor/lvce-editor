export const findNextMatch = (lines, searchString, startRowIndex) => {
  const { length } = lines
  for (let i = startRowIndex; i < length; i++) {
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
