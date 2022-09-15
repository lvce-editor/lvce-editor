import * as Assert from '../Assert/Assert.js'

export const readText = async () => {
  return navigator.clipboard.readText()
}

export const writeText = async (text) => {
  Assert.string(text)
  await navigator.clipboard.writeText(text)
}
