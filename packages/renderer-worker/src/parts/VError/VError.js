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
  let i = 1
  const childLines = child.split('\n')
  const parentLines = parent.split('\n')
  const childLinesLength = childLines.length
  const parentLinesLength = parentLines.length
  const minLines = Math.min(childLinesLength, parentLinesLength)
  while (i++ < minLines) {
    if (
      childLines[childLinesLength - i] !== parentLines[parentLinesLength - i]
    ) {
      break
    }
  }
  const topPart = parentLines.slice(0, parentLinesLength - i + 1)
  const bottomPart = childLines.slice(childLinesLength - i)
  const combined = topPart.join('\n') + '\n' + bottomPart.join('\n')
  return combined
}

export class VError extends Error {
  constructor(error, message) {
    const combinedMessage = getCombinedMessage(error, message)
    super(combinedMessage)
    this.name = 'VError'
    if (error instanceof Error) {
      this.stack = mergeStacks(this.stack, error.stack)
    }
  }
}
