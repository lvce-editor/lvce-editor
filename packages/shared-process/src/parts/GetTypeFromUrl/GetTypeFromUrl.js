import { VError } from '../VError/VError.js'

export const getTypeFromUrl = (url) => {
  if (!url) {
    throw new VError('invalid url')
  }
  const questionMarkIndex = url.indexOf('?')
  if (questionMarkIndex === -1) {
    throw new VError(`missing type parameter`)
  }
  const rest = url.slice(questionMarkIndex)
  const searchParams = new URLSearchParams(rest)
  const type = searchParams.get('type')
  return type
}
