export const findMatches = (lines, searchString) => {
  const { length } = lines
  const matches = []
  for (let i = 0; i < length; i++) {
    const line = lines[i]
    const index = line.indexOf(searchString)
    if (index !== -1) {
      matches.push(i, index)
    }
  }
  return new Uint32Array(matches)
}

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
