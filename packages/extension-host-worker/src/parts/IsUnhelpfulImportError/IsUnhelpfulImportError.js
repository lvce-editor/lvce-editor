const isUnhelpfulImportErrorChrome = (error) => {
  return error && error instanceof TypeError && error.message.startsWith('Failed to fetch dynamically imported module')
}

const isUnhelpfulImportErrorFirefox = (error) => {
  return error && error instanceof TypeError && error.message.startsWith('error loading dynamically imported module')
}

const isSyntaxError = (error) => {
  return error instanceof SyntaxError
}

export const isUnhelpfulImportError = (error) => {
  return isUnhelpfulImportErrorChrome(error) || isUnhelpfulImportErrorFirefox(error) || isSyntaxError(error)
}
