import * as Languages from '../Languages/Languages.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as TokenizePlainText from './TokenizePlainText.js'

export const state = {
  tokenizers: Object.create(null),
  tokenizePaths: Object.create(null),
  listeners: [],
  pending: Object.create(null),
}

const getTokenizePath = (languageId) => {
  const tokenizePath = Languages.getTokenizeFunctionPath(languageId)
  return tokenizePath
}

// TODO loadTokenizer should be invoked from renderer worker
export const loadTokenizer = async (languageId) => {
  if (languageId in state.tokenizers) {
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
      console.warn(
        `tokenizer.tokenizeLine should be a function in "${tokenizePath}"`
      )
      return
    }
    if (
      !tokenizer.TokenMap ||
      typeof tokenizer.TokenMap !== 'object' ||
      Array.isArray(tokenizer.TokenMap)
    ) {
      console.warn(
        `tokenizer.TokenMap should be an object in "${tokenizePath}"`
      )
      return
    }
    state.tokenizers[languageId] = tokenizer
  } catch (error) {
    state.tokenizers[languageId] = TokenizePlainText
    // TODO better error handling
    console.error(error)
    return
  }
  GlobalEventBus.emitEvent('tokenizer.changed', languageId)
}

export const getTokenizer = (languageId) => {
  if (languageId in state.tokenizers) {
    return state.tokenizers[languageId]
  }
  if (languageId in state.pending) {
    return TokenizePlainText
  }
  return TokenizePlainText
}
