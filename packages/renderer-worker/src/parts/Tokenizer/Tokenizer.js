import * as GetTokenizePath from '../GetTokenizePath/GetTokenizePath.js'
import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.js'
import * as TokenizerState from '../TokenizerState/TokenizerState.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.js'
import * as Id from '../Id/Id.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const handleTokenizeChange = async () => {
  const instances = ViewletStates.getValues()
  for (const instance of instances) {
    if (instance.state.moduleId === ViewletModuleId.EditorText) {
      const state = instance.state
      if (!TokenizerState.isConnectedEditor(state.id)) {
        return
      }
      const tokenizerId = Id.create()
      const tokenizer = getTokenizer(state.languageId)
      TokenizerMap.set(tokenizerId, tokenizer)
      const newState = {
        ...instance.state,
        tokenizerId,
        embeds: [], // force rendering
      }
      await Viewlet.setState(newState.uid, newState)
    }
  }
}

// TODO loadTokenizer should be invoked from renderer worker
export const loadTokenizer = async (languageId) => {
  if (TokenizerState.has(languageId)) {
    return
  }
  const tokenizePath = GetTokenizePath.getTokenizePath(languageId)
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
