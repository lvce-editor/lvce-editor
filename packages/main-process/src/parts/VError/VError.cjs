const MergeStacks = require('../MergeStacks/MergeStacks.cjs')
const NormalizeErrorLine = require('../NormalizeErrorLine/NormalizeErrorLine.cjs')

const getCombinedMessage = (error, message) => {
  const stringifiedError = NormalizeErrorLine.normalizeLine(`${error}`)
  if (message) {
    return `${message}: ${stringifiedError}`
  }
  return stringifiedError
}

exports.VError = class extends Error {
  constructor(error, message) {
    const combinedMessage = getCombinedMessage(error, message)
    super(combinedMessage)
    this.name = 'VError'
    if (error instanceof Error) {
      this.stack = MergeStacks.mergeStacks(this.stack, error.stack)
    }
    if (error && error.codeFrame) {
      this.codeFrame = error.codeFrame
    }
    if (error && error.code) {
      this.code = error.code
    }
  }
}
