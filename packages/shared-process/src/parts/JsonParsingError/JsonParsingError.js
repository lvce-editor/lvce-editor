import * as MergeStacks from '../MergeStacks/MergeStacks.js'

export class JsonParsingError extends Error {
  constructor(message, codeFrame, stack) {
    super(message)
    this.name = 'JsonParsingError'
    if (codeFrame) {
      this.codeFrame = codeFrame
    }

    if (stack) {
      const parent = this.stack
      const child = this.message + '\n' + stack
      this.stack = MergeStacks.mergeStacks(parent, child)
    }
  }
}
