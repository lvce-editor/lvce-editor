import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.js'
import * as TokenizerState from '../TokenizerState/TokenizerState.js'

const tokenizers = Object.create(null)

export const set = (id, value) => {
  tokenizers[id] = value
}

export const get = (id) => {
  return tokenizers[id] || TokenizePlainText
}

export const remove = (id) => {
  delete tokenizers[id]
}

export const getFromLanguage = (languageId) => {
  const tokenizer = TokenizerState.get(languageId)
  for (const [key, value] of Object.entries(tokenizers)) {
    if (value === tokenizer) {
      return parseInt(key)
    }
  }
  return -1
}

globalThis.tokenizers = tokenizers
