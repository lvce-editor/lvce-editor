import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Languages from '../Languages/Languages.js'
import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.js'
import * as TokenizerState from '../TokenizerState/TokenizerState.js'

const getTokenizePath = (languageId) => {
  const tokenizePath = Languages.getTokenizeFunctionPath(languageId)
  return tokenizePath
}

// TODO loadTokenizer should be invoked from renderer worker
export const loadTokenizer = async (languageId) => {
  if (TokenizerState.has(languageId)) {
    return
  }
  const tokenizePath = getTokenizePath(languageId)
  if (!tokenizePath) {
    return
  }
  try {
    // TODO check that tokenizer is valid
    // 1. tokenizeLine should be of type function
    // 2. getTokenClass should be of type function
    const tokenizer = await import(tokenizePath)
    if (typeof tokenizer.tokenizeLine !== 'function') {
      console.warn(`tokenizer.tokenizeLine should be a function in "${tokenizePath}"`)
      return
    }
    if (!tokenizer.TokenMap || typeof tokenizer.TokenMap !== 'object' || Array.isArray(tokenizer.TokenMap)) {
      console.warn(`tokenizer.TokenMap should be an object in "${tokenizePath}"`)
      return
    }
    TokenizerState.set(languageId, tokenizer)
  } catch (error) {
    TokenizerState.set(languageId, TokenizePlainText)
    // TODO better error handling
    console.error(error)
    return
  }
  GlobalEventBus.emitEvent('tokenizer.changed', languageId)
}

export const getTokenizer = (languageId) => {
  if (TokenizerState.has(languageId)) {
    return TokenizerState.get(languageId)
  }
  if (TokenizerState.isPending(languageId)) {
    return TokenizePlainText
  }
  return TokenizePlainText
}
