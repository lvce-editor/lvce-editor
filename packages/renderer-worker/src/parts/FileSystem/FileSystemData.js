export const copy = (protocol, source, target) => {
  throw new Error('not implemented')
}

export const readFile = (protocol, path) => {
  return path.slice(protocol.length + 3)
}

export const remove = (protocol, path) => {
  throw new Error('not implemented')
}

export const rename = (protocol, oldUri, newUri) => {
  throw new Error('not implemented')
}

export const mkdir = (protocol, path) => {
  throw new Error('not implemented')
}

export const writeFile = async (protocol, path, content) => {
  throw new Error('not implemented')
}

export const ensureFile = async () => {}

export const readDirWithFileTypes = (protocol, path) => {
  throw new Error('not implemented')
}

export const getBlobUrl = (protocol, path) => {
  throw new Error('not implemented')
}

export const getPathSeparator = (protocol) => {
  throw new Error('not implemented')
}
