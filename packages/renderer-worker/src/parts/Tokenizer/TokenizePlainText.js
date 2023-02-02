/**
 * @enum number
 */
export const State = {
  TopLevelContent: 1,
}

/**
 * @enum number
 */
export const TokenType = {
  Text: 1,
}

export const TokenMap = {
  [TokenType.Text]: 'Text',
}

export const initialLineState = {
  state: State.TopLevelContent,
}

export const hasArrayReturn = true

export const tokenizeLine = (line, lineState) => {
  return {
    tokens: [line.length, TokenType.Text],
    state: lineState.state,
  }
}
