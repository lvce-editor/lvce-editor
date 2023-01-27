import * as GetLineAndColumn from '../GetLineAndColumn/GetLineAndColumn.js'

export class DependencyNotFoundError extends Error {
  constructor(code, start, end, dependencyRelativePath, dependencyUrl, sourceUrl) {
    super(`module not found "${dependencyRelativePath}"`)
    const { line, column } = GetLineAndColumn.getLineAndColumn(code, start, end)
    this.stack = `${this.message}
    at Module (${sourceUrl}:${line}:${column})`
  }
}
