import { VError } from '../VError/VError.js'

export const getTypeFromUrl = (url) => {
  if (!url) {
    throw new VError('invalid url')
  }
  const questionMarkIndex = url.indexOf('?')
  if (questionMarkIndex === -1) {
    const slashIndex = url.lastIndexOf('/')
    const rest = url.slice(slashIndex + 1)
    if (!rest) {
      throw new Error('missing type parameter')
    }
    return rest
  }
  const rest = url.slice(questionMarkIndex)
  const searchParams = new URLSearchParams(rest)
  const type = searchParams.get('type')
  return type
}
