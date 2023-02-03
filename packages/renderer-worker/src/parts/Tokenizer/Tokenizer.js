import * as Languages from '../Languages/Languages.js'
import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'
import * as TokenizerState from '../TokenizerState/TokenizerState.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const getTokenizePath = (languageId) => {
  const tokenizePath = Languages.getTokenizeFunctionPath(languageId)
  return tokenizePath
}

export const handleTokenizeChange = async () => {
  const instances = ViewletStates.getAllInstances()
  const instance = instances.EditorText
  if (!instance) {
    return
  }
  const state = instance.state
  if (!TokenizerState.isConnectedEditor(state.id)) {
    return
  }
  const tokenizer = Tokenizer.getTokenizer(state.languageId)
  const newState = {
    ...instance.state,
    tokenizer,
    embeds: [], // force rendering
  }
  await Viewlet.setState('EditorText', newState)
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
    // TODO better error handling
    console.error(error)
    return
  }
  await handleTokenizeChange()
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

export const addConnectedEditor = (id) => {
  TokenizerState.addConnectedEditor(id)
}

export const removeConnectedEditor = (id) => {
  TokenizerState.removeConnectedEditor(id)
}
