import * as Assert from '../Assert/Assert.ts'

interface State {
  warned: any[]
}

export const state: State = {
  warned: [],
}

const flattenTokensArray = (tokens) => {
  const flattened: number[] = []
  for (const token of tokens) {
    Assert.object(token)
    flattened.push(token.type, token.length)
  }
  return flattened
}

const warnDeprecatedArrayReturn = (languageId, fn) => {
  if (state.warned.includes(fn)) {
    return
  }
  state.warned.push(fn)
  console.warn(`tokenizers without hasArrayReturn=false are deprecated (language ${languageId})`)
}
/**
 *
 * @param {(line:string, lineState)=>any} tokenizeLine
 * @param {string} line
 * @param {any} lineStateAtStart
 * @param {boolean} hasArrayReturn
 * @returns
 */
export const safeTokenizeLine = (languageId, tokenizeLine, line, lineStateAtStart, hasArrayReturn) => {
  try {
    const lineState = tokenizeLine(line, lineStateAtStart)
    if (!lineState || !lineState.tokens || !lineState.state) {
      throw new Error('invalid tokenization result')
    }
    if (!hasArrayReturn) {
      warnDeprecatedArrayReturn(languageId, tokenizeLine)
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
