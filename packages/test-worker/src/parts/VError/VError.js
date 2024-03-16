import * as MergeStacks from '../MergeStacks/MergeStacks.js'

const stringifyError = (error) => {
  if (error instanceof DOMException && error.message) {
    return `DOMException: ${error.message}`
  }
  const errorPrefixes = ['Error: ', 'VError: ']
  const stringifiedError = `${error}`
  for (const errorPrefix of errorPrefixes) {
    if (stringifiedError.startsWith(errorPrefix)) {
      return stringifiedError.slice(errorPrefix.length)
    }
  }
  return stringifiedError
}

const getCombinedMessage = (error, message) => {
  const stringifiedError = stringifyError(error)
  if (message) {
    return `${message}: ${stringifiedError}`
  }
  return `${stringifiedError}`
}

export class VError extends Error {
  constructor(error, message) {
    const combinedMessage = getCombinedMessage(error, message)
    super(combinedMessage)
    this.name = 'VError'
    if (error instanceof Error) {
      this.stack = MergeStacks.mergeStacks(this.stack, error.stack)
    }
    if (error.codeFrame) {
      this.codeFrame = error.codeFrame
    }
  }
}
