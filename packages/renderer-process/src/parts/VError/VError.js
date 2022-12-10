const getCombinedMessage = (error, message) => {
  if (message) {
    return `${message}: ${error}`
  }
  return `${error}`
}

const mergeStacks = (parent, child) => {
  if (!child) {
    return parent
  }
  const parentNewLineIndex = parent.indexOf('\n')
  const childNewLineIndex = child.indexOf('\n')
  const parentFirstLine = parent.slice(0, parentNewLineIndex)
  const childRest = child.slice(childNewLineIndex)
  const childFirstLine = child.slice(0, childNewLineIndex)
  if (parentFirstLine.includes(childFirstLine)) {
    return parentFirstLine + childRest
  }
  return child
}

const getErrorStack = (error) => {
  if (error && error.stack) {
    return error.stack
  }
  if (error && error.lineNumber && error.columnNumber && error.fileName) {
    return `${error.message}\n  at ${error.fileName}:${error.lineNumber}:${error.columnNumber}`
  }
  return ''
}

export class VError extends Error {
  constructor(error, message) {
    const combinedMessage = getCombinedMessage(error, message)
    super(combinedMessage)
    this.name = 'VError'
    console.log({ originalStack: error.stack, originalError: error })

    if (error instanceof Error) {
      const errorStack = getErrorStack(error)
      this.stack = mergeStacks(this.stack, errorStack)
    }
    if (error.codeFrame) {
      this.codeFrame = error.codeFrame
    }
  }
}
