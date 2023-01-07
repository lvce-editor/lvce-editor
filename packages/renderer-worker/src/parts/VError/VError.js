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

const mergeStacks = (parent, child) => {
  if (!child) {
    return parent
  }
  const parentNewLineIndex = parent.indexOf('\n')
  const childNewLineIndex = child.indexOf('\n')
  if (childNewLineIndex === -1) {
    return parent
  }
  const parentFirstLine = parent.slice(0, parentNewLineIndex)
  const childRest = child.slice(childNewLineIndex)
  const childFirstLine = child.slice(0, childNewLineIndex)
  if (parentFirstLine.includes(childFirstLine)) {
    return parentFirstLine + childRest
  }
  return child
}

export class VError extends Error {
  constructor(error, message) {
    const combinedMessage = getCombinedMessage(error, message)
    super(combinedMessage)
    this.name = 'VError'
    if (error instanceof Error) {
      this.stack = mergeStacks(this.stack, error.stack)
    }
    if (error.codeFrame) {
      this.codeFrame = error.codeFrame
    }
  }
}
