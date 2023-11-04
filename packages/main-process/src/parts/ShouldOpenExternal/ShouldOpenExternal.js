export const shouldOpenExternal = (url) => {
  if (url.startsWith('http:') || url.startsWith('https:')) {
    return true
  }
  return false
}
