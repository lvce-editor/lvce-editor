export const isUnhelpfulImportError = (error) => {
  if (error && error instanceof TypeError && error.message.startsWith('Failed to fetch dynamically imported module')) {
    return true
  }
  if (error instanceof SyntaxError) {
    return true
  }
  return false
}
