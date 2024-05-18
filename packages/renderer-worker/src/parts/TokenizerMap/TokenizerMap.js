import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.js'

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
