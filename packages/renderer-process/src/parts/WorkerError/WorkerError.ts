import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

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
