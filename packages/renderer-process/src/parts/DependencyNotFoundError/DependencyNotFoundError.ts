import * as GetLineAndColumn from '../GetLineAndColumn/GetLineAndColumn.ts'

export class DependencyNotFoundError extends Error {
  constructor(code, start, end, dependencyRelativePath, dependencyUrl, sourceUrl) {
    super(`Module not found "${dependencyRelativePath}"`)
    const { line, column } = GetLineAndColumn.getLineAndColumn(code, start, end)
    this.stack = `${this.message}
    at Module (${sourceUrl}:${line}:${column})`
  }
}
