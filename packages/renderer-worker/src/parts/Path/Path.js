export const fileExtension = (uri) => {
  const extensionIndex = uri.lastIndexOf('.')
  const extension = uri.slice(extensionIndex)
  return extension
}

export const join = (pathSeparator, ...parts) => {
  return parts.join(pathSeparator)
}

export const getDirName = (pathSeparator, path) => {
  const index = path.lastIndexOf(pathSeparator)
  if (index === -1) {
    return path
  }
  return path.slice(0, index)
}

export const getBaseName = (pathSeparator, path) => {
  return path.slice(path.lastIndexOf(pathSeparator) + 1)
}
