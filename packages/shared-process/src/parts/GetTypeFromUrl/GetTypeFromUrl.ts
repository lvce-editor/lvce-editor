import { VError } from '../VError/VError.ts'

export const getTypeFromUrl = (url: any): any => {
  if (!url) {
    throw new VError('invalid url')
  }
  const questionMarkIndex = url.indexOf('?')
  const path = questionMarkIndex === -1 ? url : url.slice(0, questionMarkIndex)
  const slashIndex = path.lastIndexOf('/')
  const pathType = path.slice(slashIndex + 1)
  if (pathType) {
    return pathType
  }
  if (questionMarkIndex !== -1) {
    // deprecated
    const searchParams = new URLSearchParams(url.slice(questionMarkIndex))
    const queryType = searchParams.get('type')
    if (queryType) {
      return queryType
    }
  }
  throw new Error('missing type parameter')
}
