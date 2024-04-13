export const getLineInfo = (line: string, tokens: number[], TokenMap: Record<number, string>) => {
  const tokensLength = tokens.length
  let end = 0
  let start = 0
  const lineInfo: any[] = []
  for (let i = 0; i < tokensLength; i += 2) {
    const tokenType = tokens[i]
    const tokenLength = tokens[i + 1]
    end += tokenLength
    const text = line.slice(start, end)
    const className = `Token ${TokenMap[tokenType] || 'Unknown'}`
    const normalizedText = text
    lineInfo.push(normalizedText, className)
    start = end
  }
  return lineInfo
}
