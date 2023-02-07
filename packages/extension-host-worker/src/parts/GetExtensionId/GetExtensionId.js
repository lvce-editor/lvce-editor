const baseName = (path) => {
  const slashIndex = path.lastIndexOf('/')
  return path.slice(slashIndex + 1)
}

export const getExtensionId = (extension) => {
  if (extension && extension.id) {
    return extension.id
  }
  if (extension && extension.path) {
    return baseName(extension.path)
  }
  return '<unknown>'
}
