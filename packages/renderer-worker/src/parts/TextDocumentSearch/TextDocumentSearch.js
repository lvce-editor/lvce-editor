export const findMatches = (lines, searchString) => {
  if (searchString.length === 0) {
    return new Uint32Array([])
  }
  const { length } = lines
  const matches = []
  const searchStringLength = searchString.length
  for (let i = 0; i < length; i++) {
    const line = lines[i]
    let lastMatchIndex = -searchStringLength
    while ((lastMatchIndex = line.indexOf(searchString, lastMatchIndex + searchStringLength)) !== -1) {
      matches.push(i, lastMatchIndex)
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
