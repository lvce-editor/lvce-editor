import * as GetHelpfulChildProcessError from '../GetHelpfulChildProcessError/GetHelpfulChildProcessError.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

export class ChildProcessError extends Error {
  constructor(stderr) {
    const { message, code, stack } = GetHelpfulChildProcessError.getHelpfulChildProcessError('', stderr)
    super(message || 'child process error')
    this.name = 'ChildProcessError'
    if (code) {
      this.code = code
    }
    if (stack) {
      const lines = SplitLines.splitLines(this.stack)
      const [firstLine, ...stackLines] = lines
      const newStackLines = [firstLine, ...stack, ...stackLines]
      const newStack = JoinLines.joinLines(newStackLines)
      this.stack = newStack
    }
  }
}
