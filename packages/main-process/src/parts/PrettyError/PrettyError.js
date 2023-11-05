import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.js'

export { prepare, prepareJsonError } from '@lvce-editor/pretty-error'

export const print = (prettyError) => {
  console.error(`Error: ${prettyError.message}\n\n${prettyError.codeFrame}\n\n${prettyError.stack}`)
}

export const firstErrorLine = (error) => {
  if (error.stack) {
    return error.stack.slice(0, GetNewLineIndex.getNewLineIndex(error.stack))
  }
  if (error.message) {
    return error.message
  }
  return `${error}`
}
