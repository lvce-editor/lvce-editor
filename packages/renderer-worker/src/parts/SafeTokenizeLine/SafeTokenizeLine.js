import * as Assert from '../Assert/Assert.js'
import * as Logger from '../Logger/Logger.js'

export const state = {
  warned: [],
}

const flattenTokensArray = (tokens) => {
  const flattened = []
  for (const token of tokens) {
    Assert.object(token)
    flattened.push(token.type, token.length)
  }
  return flattened
}

const warnDeprecatedArrayReturn = (fn) => {
  if (state.warned.includes(fn)) {
    return
  }
  state.warned.push(fn)
  Logger.warn(`tokenizers without hasArrayReturn=false are deprecated`)
}
/**
 *
 * @param {(line:string, lineState)=>any} tokenizeLine
 * @param {string} line
 * @param {any} lineStateAtStart
 * @param {boolean} hasArrayReturn
 * @returns
 */
export const safeTokenizeLine = (tokenizeLine, line, lineStateAtStart, hasArrayReturn) => {
  try {
    const lineState = tokenizeLine(line, lineStateAtStart)
    if (!lineState || !lineState.tokens || !lineState.state) {
      throw new Error('invalid tokenization result')
    }
    if (!hasArrayReturn) {
      warnDeprecatedArrayReturn(tokenizeLine)
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
