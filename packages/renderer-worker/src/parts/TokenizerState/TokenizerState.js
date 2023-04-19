export const state = {
  tokenizers: Object.create(null),
  tokenizePaths: Object.create(null),
  listeners: [],
  pending: Object.create(null),
  /**
   * @type {number[]}
   */
  connectedEditors: [],
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

export const addConnectedEditor = (id) => {
  state.connectedEditors.push(id)
}

export const removeConnectedEditor = (id) => {
  const index = state.connectedEditors.indexOf(id)
  if (index === -1) {
    throw new Error('unexpected index')
  }
  state.connectedEditors.splice(index, 1)
}

export const isConnectedEditor = (id) => {
  return state.connectedEditors.includes(id)
}
