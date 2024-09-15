export const hasStaticPrefix = (filePath) => {
  if (filePath.startsWith('css')) {
    return true
  }
  if (filePath.startsWith('file-icons')) {
    return true
  }
  if (filePath.startsWith('config')) {
    return true
  }
  if (filePath.startsWith('fonts')) {
    return true
  }
  if (filePath.startsWith('icons')) {
    return true
  }
  if (filePath.startsWith('js')) {
    return true
  }
  if (filePath.startsWith('lib-css')) {
    return true
  }
  if (filePath.startsWith('themes')) {
    return true
  }
  return false
}
