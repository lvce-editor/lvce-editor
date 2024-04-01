export const getCombinedErrorMessage = (error, message) => {
  // DOMException.toString is different from what is displayed in console
  if (error && error instanceof DOMException && message) {
    return `${message} DOMException: ${error.message}`
  }
  if (message) {
    return `${message}: ${error}`
  }
  return `${error}`
}
