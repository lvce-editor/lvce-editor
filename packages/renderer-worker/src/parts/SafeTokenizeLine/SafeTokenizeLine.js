const flattenTokensArray = (tokens) => {
  const flattened = []
  for (const token of tokens) {
    flattened.push(token.type, token.length)
  }
  return flattened
}
/**
 *
 * @param {(line:string, lineState)=>any} tokenizeLine
 * @param {string} line
 * @param {any} lineStateAtStart
 * @param {boolean} hasArrayReturn
 * @returns
 */
export const safeTokenizeLine = (
  tokenizeLine,
  line,
  lineStateAtStart,
  hasArrayReturn
) => {
  try {
    const lineState = tokenizeLine(line, lineStateAtStart)
    if (!lineState || !lineState.tokens || !lineState.state) {
      throw new Error('invalid tokenization result')
    }
    if (!hasArrayReturn) {
      // workaround for old tokenizers
      lineState.tokens = flattenTokensArray(lineState.tokens)
    }
    return lineState
  } catch (error) {
    console.error(error)
    return {
      tokens: [/* type */ 0, /* length */ line.length],
      lineState: lineStateAtStart,
    }
  }
}
