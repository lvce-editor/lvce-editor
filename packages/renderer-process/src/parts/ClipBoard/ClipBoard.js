import * as Assert from '../Assert/Assert.js'

export const readText = async () => {
  return navigator.clipboard.readText()
}

export const writeText = async (text) => {
  Assert.string(text)
  await navigator.clipboard.writeText(text)
}

export const writeImage = async (blob) => {
  console.log('blob', blob)
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
}
