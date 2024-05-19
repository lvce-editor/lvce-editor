import * as GetFileExtension from '../GetFileExtension/GetFileExtension.js'
import * as Assert from '../Assert/Assert.ts'

export const fileExtension = (uri) => {
  Assert.string(uri)
  return GetFileExtension.getFileExtension(uri)
}

export const join = (pathSeparator, ...parts) => {
  return parts.join(pathSeparator)
}

export const dirname = (pathSeparator, path) => {
  const index = path.lastIndexOf(pathSeparator)
  if (index === -1) {
    return path
  }
  return path.slice(0, index)
}

export const getBaseName = (pathSeparator, path) => {
  return path.slice(path.lastIndexOf(pathSeparator) + 1)
}
