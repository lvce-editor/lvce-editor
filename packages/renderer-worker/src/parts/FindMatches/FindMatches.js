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
