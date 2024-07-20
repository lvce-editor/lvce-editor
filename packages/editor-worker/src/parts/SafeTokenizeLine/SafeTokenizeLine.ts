import * as Assert from '../Assert/Assert.ts'

interface State {
  warned: any[]
}

export const state: State = {
  warned: [],
}

const flattenTokensArray = (tokens: any) => {
  const flattened: number[] = []
  for (const token of tokens) {
    Assert.object(token)
    flattened.push(token.type, token.length)
  }
  return flattened
}

const warnDeprecatedArrayReturn = (languageId: string, fn: any) => {
  if (state.warned.includes(fn)) {
    return
  }
  state.warned.push(fn)
  console.warn(`tokenizers without hasArrayReturn=false are deprecated (language ${languageId})`)
}

export const safeTokenizeLine = (languageId: string, tokenizeLine: any, line: string, lineStateAtStart: any, hasArrayReturn: boolean) => {
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
