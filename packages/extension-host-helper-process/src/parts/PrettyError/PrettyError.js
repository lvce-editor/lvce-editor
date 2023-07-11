import { codeFrameColumns } from '@babel/code-frame'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as CleanStack from '../CleanStack/CleanStack.js'

const getActualPath = (fileUri) => {
  if (fileUri.startsWith('file://')) {
    return fileURLToPath(fileUri)
  }
  return fileUri
}

export const prepare = (error) => {
  const message = error.message
  if (error && error.cause) {
    const cause = error.cause()
    if (cause) {
      error = cause
    }
  }
  const lines = CleanStack.cleanStack(error.stack)
  const file = lines[0]
  let codeFrame = ''
  if (error.codeFrame) {
    codeFrame = error.codeFrame
  } else if (file) {
    let match = file.match(/\((.*):(\d+):(\d+)\)$/)
    if (!match) {
      match = file.match(/at (.*):(\d+):(\d+)$/)
    }
    if (match) {
      const [_, path, line, column] = match
      const actualPath = getActualPath(path)
      const rawLines = readFileSync(actualPath, 'utf-8')
      const location = {
        start: {
          line: Number.parseInt(line),
          column: Number.parseInt(column),
        },
      }

      codeFrame = codeFrameColumns(rawLines, location)
    }
  }
  const relevantStack = lines.slice(1).join('\n')
  return {
    message,
    stack: relevantStack,
    codeFrame,
    code: error.code,
    type: error.constructor.name,
    stderr: error.stderr,
    stdout: error.stdout,
  }
}
