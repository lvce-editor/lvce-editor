import VError from 'verror'
import * as SplitLines from '../SplitLines/SplitLines.js'

const isStackStart = (line) => {
  return line.startsWith('    at')
}

const cleanSyntaxError = (error) => {
  if (!error.stack) {
    return error
  }
  const lines = SplitLines.splitLines(error.stack)
  const startIndex = lines.findIndex(isStackStart)
  if (startIndex === -1) {
    return error
  }
}

const cleanImportError = (error) => {
  if (error && error instanceof SyntaxError) {
    return cleanSyntaxError(error)
  }
  return error
}

export class ImportError extends VError {
  constructor(error, message) {
    const cleanError = cleanImportError(error)
    super(cleanError, message)
  }
}
