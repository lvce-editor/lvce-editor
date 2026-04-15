export const name = 'Data'

const dataPrefix = 'data://'

const getPath = (uri) => {
  if (uri.startsWith(dataPrefix)) {
    return uri.slice(dataPrefix.length)
  }
  return uri
}

export const copy = (source, target) => {
  throw new Error('not implemented')
}

export const readFile = (path) => {
  return getPath(path)
}

export const remove = (path) => {
  throw new Error('not implemented')
}

export const rename = (oldUri, newUri) => {
  throw new Error('not implemented')
}

export const mkdir = (path) => {
  throw new Error('not implemented')
}

export const writeFile = async (path, content) => {
  throw new Error('not implemented')
}

export const ensureFile = async () => {}

export const readDirWithFileTypes = (path) => {
  throw new Error('not implemented')
}

export const getBlobUrl = (path) => {
  throw new Error('not implemented')
}

export const getPathSeparator = () => {
  throw new Error('not implemented')
}
