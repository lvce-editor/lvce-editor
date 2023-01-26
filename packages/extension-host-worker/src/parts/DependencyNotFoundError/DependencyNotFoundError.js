import * as GetLineAndColumn from '../GetLineAndColumn/GetLineAndColumn.js'

export class DependencyNotFoundError extends Error {
  constructor(code, start, end, dependencyRelativePath, dependencyUrl) {
    super(`dependency not found ${dependencyRelativePath}`)
    const { line, column } = GetLineAndColumn.getLineAndColumn(code, start, end)
    this.stack = `dependency not found ${dependencyRelativePath}
    at ${dependencyUrl}:${line}:${column}`
  }
}
