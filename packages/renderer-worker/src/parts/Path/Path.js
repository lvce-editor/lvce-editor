export const fileExtension = (uri) => {
  const extensionIndex = uri.lastIndexOf('.')
  const extension = uri.slice(extensionIndex)
  return extension
}
