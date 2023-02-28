import * as JoinLines from '../JoinLines/JoinLines.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

export class JsonParsingError extends Error {
  constructor(message, codeFrame, stack) {
    super(message)
    this.name = 'JsonParsingError'
    if (codeFrame) {
      this.codeFrame = codeFrame
    }

    if (stack) {
      const parentStack = JoinLines.joinLines(SplitLines.splitLines(this.stack).slice(1))
      this.stack = this.name + ': ' + this.message + '\n' + stack + '\n' + parentStack
    }
  }
}
