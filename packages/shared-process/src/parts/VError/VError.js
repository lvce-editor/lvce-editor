import * as MergeStacks from '../MergeStacks/MergeStacks.js'

const getCombinedMessage = (error, message) => {
  let stringifiedError = `${error}`
  if (stringifiedError.startsWith('Error: ')) {
    stringifiedError = stringifiedError.slice(`Error: `.length)
  } else if (stringifiedError.startsWith('VError: ')) {
    stringifiedError = stringifiedError.slice(`VError: `.length)
  }
  if (message) {
    return `${message}: ${stringifiedError}`
  }
  return stringifiedError
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
    if (error.code) {
      this.code = error.code
    }
  }
}
