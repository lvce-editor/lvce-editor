import * as TokenizePlainText from '../TokenizePlainText/TokenizePlainText.ts'

const tokenizers = Object.create(null)

export const set = (id: any, value: any) => {
  tokenizers[id] = value
}

export const get = (id: any) => {
  return tokenizers[id] || TokenizePlainText
}

export const remove = (id: any) => {
  delete tokenizers[id]
}
