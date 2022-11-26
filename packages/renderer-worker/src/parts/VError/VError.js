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
  // console.log({ parent, child, childRest })
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
