export const name = 'Data'

export const copy = (source, target) => {
  throw new Error('not implemented')
}

export const readFile = (path) => {
  return path.slice('data://'.length + 3)
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
