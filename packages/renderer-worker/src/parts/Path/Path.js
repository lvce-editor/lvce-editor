export const fileExtension = (uri) => {
  const extensionIndex = uri.lastIndexOf('.')
  const extension = uri.slice(extensionIndex)
  return extension
}

export const join = (pathSeparator, ...parts) => {
  return parts.join(pathSeparator)
}
