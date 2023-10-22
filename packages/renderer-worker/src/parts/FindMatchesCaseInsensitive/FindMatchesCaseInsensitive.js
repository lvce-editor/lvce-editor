const regexFlags = 'gi'

const getSearchRegex = (searchString) => {
  return new RegExp(searchString, regexFlags)
}

export const findMatchesCaseInsensitive = (lines, searchString) => {
  if (searchString.length === 0) {
    return new Uint32Array([])
  }
  const regex = getSearchRegex(searchString)
  const { length } = lines
  const matches = []
  for (let i = 0; i < length; i++) {
    const line = lines[i]
    let lastMatch
    do {
      lastMatch = regex.exec(line)
      if (!lastMatch) {
        break
      }
      matches.push(i, lastMatch.index)
    } while (true)
  }
  return new Uint32Array(matches)
}
