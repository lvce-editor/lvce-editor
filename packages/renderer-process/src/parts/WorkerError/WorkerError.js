import * as SplitLines from '../SplitLines/SplitLines.js'
import * as JoinLines from '../JoinLines/JoinLines.js'

export class WorkerError extends Error {
  constructor(event) {
    super(event.message)
    const stackLines = SplitLines.splitLines(this.stack)
    const relevantLines = stackLines.slice(1)
    const relevant = JoinLines.joinLines(relevantLines)
    this.stack = `${event.message}
    at Module (${event.filename}:${event.lineno}:${event.colno})
${relevant}`
  }
}
