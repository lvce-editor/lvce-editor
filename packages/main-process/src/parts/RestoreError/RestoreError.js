exports.restoreError = (error) => {
  if (error && error instanceof Error) {
    return error
  }
  if (error && typeof error === 'object' && 'jse_shortmsg' in error && 'jse_cause' in error && error.jse_cause instanceof Error) {
    const actualError = new Error(error.jse_shortmsg + ': ' + error.jse_cause.message)
    actualError.stack = `${actualError.message}\n${error.jse_cause.stack}`
    return actualError
  }
  return error
}
