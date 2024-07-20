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

export const has = (languageId: any) => {
  return languageId in state.tokenizers
}

export const set = (languageId: any, tokenizer: any) => {
  state.tokenizers[languageId] = tokenizer
}

export const get = (languageId: any) => {
  return state.tokenizers[languageId]
}

export const isPending = (languageId: any) => {
  return languageId in state.pending
}
