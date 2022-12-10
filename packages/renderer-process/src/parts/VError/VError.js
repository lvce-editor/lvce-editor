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
  console.log({
    parentFirstLine,
    childFirstLine,
    eq: parentFirstLine.includes(childFirstLine),
  })
  if (parentFirstLine.includes(childFirstLine)) {
    return parentFirstLine + childRest
  }
  return child
}

const getErrorStack = (error) => {
  if (error && error.stack) {
    return error.stack
  }
  console.log('else')
  if (error && error.lineNumber && error.columnNumber && error.fileName) {
    console.log(error.lineNumber)
    const normalStackLooksLike = new Error().stack
    if (/^[a-zA-Z\$\_\d]+@.*/.test(normalStackLooksLike)) {
      console.log({ e: `${error}` })
      // firefox stack trace
      return `${error}\nunknown@${error.fileName}:${error.lineNumber}:${error.columnNumber}`
    }
    // chrome stack trace
    return `${error.message}\n  at ${error.fileName}:${error.lineNumber}:${error.columnNumber}`
  }
  return ''
}

export class VError extends Error {
  constructor(error, message) {
    const combinedMessage = getCombinedMessage(error, message)
    super(combinedMessage)
    this.name = 'VError'
    if (error instanceof Error) {
      const errorStack = getErrorStack(error)
      this.stack = mergeStacks(this.stack, errorStack)
    }
    if (error.codeFrame) {
      this.codeFrame = error.codeFrame
    }
    this.cause = error
  }
}
