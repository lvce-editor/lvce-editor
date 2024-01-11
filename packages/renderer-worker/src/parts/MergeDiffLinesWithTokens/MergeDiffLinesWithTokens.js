const getLineInfoDefault = (line, tokens, tokenMap) => {
  const result = []
  let start = 0
  let end = 0
  for (let i = 0; i < tokens.length; i += 2) {
    const tokenType = tokens[i]
    const tokenLength = tokens[i + 1]
    end += tokenLength
    const text = line.slice(start, end)
    const className = `Token ${tokenMap[tokenType] || 'Unknown'}`
    result.push(text, className)
    start = end
  }
  return result
}

export const mergeDiffLinesWithTokens = (diffLines, tokens, tokenMap) => {
  const length = diffLines.length
  const merged = []
  for (let i = 0; i < length; i++) {
    const diffLine = diffLines[i]
    const innerTokens = tokens[i] ? tokens[i].tokens : []
    merged.push({
      ...diffLine,
      tokens: innerTokens,
      lineInfo: getLineInfoDefault(diffLine.line, innerTokens, tokenMap),
    })
  }
  return merged
}
