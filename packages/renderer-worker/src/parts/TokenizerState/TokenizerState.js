export const state = {
  tokenizers: Object.create(null),
  tokenizePaths: Object.create(null),
  listeners: [],
  pending: Object.create(null),
}

export const has = (languageId) => {
  return languageId in state.tokenizers
}

export const set = (languageId, tokenizer) => {
  state.tokenizers[languageId] = tokenizer
}

export const get = (languageId) => {
  return state.tokenizers[languageId]
}

export const isPending = (languageId) => {
  return languageId in state.pending
}
