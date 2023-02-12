import * as Location from '../Location/Location.js'

export const createObjectUrl = (blob) => {
  return URL.createObjectURL(blob)
}

export const revokeObjectUrl = (url) => {
  return URL.revokeObjectURL(url)
}

export const getAbsoluteUrl = (relativePath, sourceUrl) => {
  if (sourceUrl.startsWith('/')) {
    const origin = Location.getOrigin()
    const absoluteSourceUrl = new URL(sourceUrl, origin).toString()
    return new URL(relativePath, absoluteSourceUrl).toString()
  }
  return new URL(relativePath, sourceUrl).toString()
}
