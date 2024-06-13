import * as Character from '../Character/Character.ts'

export const normalizeText = (text: string, normalize: any, tabSize: number) => {
  if (normalize) {
    return text.replaceAll(Character.Tab, Character.Space.repeat(tabSize))
  }
  return text
}

export const shouldNormalizeText = (text: string) => {
  return text.includes(Character.Tab)
}
