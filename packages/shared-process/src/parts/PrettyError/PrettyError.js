import { codeFrameColumns } from '@babel/code-frame'
import { LinesAndColumns } from 'lines-and-columns'
import * as Json from '../Json/Json.js'
export { prepare } from '@lvce-editor/pretty-error'

const fixBackslashes = (string) => {
  return string.replaceAll('\\\\', '\\')
}

export const prepareJsonError = (json, property, message) => {
  const string = fixBackslashes(Json.stringify(json))
  const stringifiedPropertyName = `"${property}"`
  const index = string.indexOf(stringifiedPropertyName) // TODO this could be wrong in some cases, find a better way
  console.log({ string, index })
  const jsonError = {
    stack: '',
  }
  if (index !== -1) {
    const lines = new LinesAndColumns(string)
    const location = lines.locationForIndex(index + stringifiedPropertyName.length + 1)
    const codeFrame = codeFrameColumns(string, {
      // @ts-ignore
      start: { line: location.line + 1, column: location.column + 1 },
    })
    jsonError.codeFrame = codeFrame
  }
  // jsonError.stack = `${bottomMessage}\n    at ${filePath}`
  return jsonError
}
