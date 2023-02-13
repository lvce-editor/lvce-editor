import * as GetLineAndColumn from '../GetLineAndColumn/GetLineAndColumn.js'

const getErrorMessage = (dependencyRelativePath) => {
  return `module not found "${dependencyRelativePath}"`
}

const getErrorStack = (message, sourceUrl, line, column) => {
  return `${message}
  at Module (${sourceUrl}:${line}:${column})`
}

export class DependencyNotFoundError extends Error {
  constructor(code, start, end, dependencyRelativePath, dependencyUrl, sourceUrl) {
    super(getErrorMessage(dependencyRelativePath))
    this.name = 'DependencyNotFoundError'
    const { line, column } = GetLineAndColumn.getLineAndColumn(code, start, end)
    this.stack = getErrorStack(this.message, sourceUrl, line, column)
  }
}
