/**
 * @enum number
 */
export const TokenType = {
  Xyz: 1,
}

export const TokenMap = {
  [TokenType.Xyz]: 'Xyz',
}

export const initialLineState = {
  state: 1,
  tokens: [],
}

/**
 * @param {string} line
 */
export const tokenizeLine = (line) => {
  const tokens = [
    {
      type: TokenType.Xyz,
      length: line.length,
    },
  ]
  return {
    state: 1,
    tokens,
  }
}
