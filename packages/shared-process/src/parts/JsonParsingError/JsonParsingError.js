import * as JoinLines from '../JoinLines/JoinLines.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export class JsonParsingError extends Error {
  constructor(message, codeFrame, stack) {
    super(message)
    this.name = 'JsonParsingError'
    this.code = ErrorCodes.E_JSON_PARSE
    if (codeFrame) {
      this.codeFrame = codeFrame
    }

    if (stack) {
      const parentStack = JoinLines.joinLines(SplitLines.splitLines(this.stack).slice(1))
      this.stack = this.name + ': ' + this.message + '\n' + stack + '\n' + parentStack
    }
  }
}
