import * as Character from '../Character/Character.ts'

export const normalizeText = (text, normalize, tabSize) => {
  if (normalize) {
    return text.replaceAll(Character.Tab, Character.Space.repeat(tabSize))
  }
  return text
}

export const shouldNormalizeText = (text) => {
  return text.includes(Character.Tab)
}
