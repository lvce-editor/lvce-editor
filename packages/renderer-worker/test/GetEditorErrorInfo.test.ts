import { expect, test } from '@jest/globals'
import * as EditorErrorType from '../src/parts/EditorErrorType/EditorErrorType.ts'
import * as GetEditorErrorInfo from '../src/parts/GetEditorErrorinfo/GetEditorErrorInfo.js'

test('error - not found', () => {
  const error = {
    code: 'ENOENT',
    message: 'file not found',
  }
  const info = GetEditorErrorInfo.getEditorErrorInfo(error)
  expect(info).toEqual({
    type: EditorErrorType.Error,
    message: 'The editor could not be opened because the file was not found',
    actions: [
      {
        name: 'Create File',
      },
    ],
  })
})

test('error - other', () => {
  const error = new TypeError(`x is not a function`)
  const info = GetEditorErrorInfo.getEditorErrorInfo(error)
  expect(info).toEqual({
    type: EditorErrorType.Error,
    message: 'TypeError: x is not a function',
    actions: [],
  })
})

test('error - prepared message', () => {
  const error = new RangeError('Maximum call stack size exceeded')
  const preparedMessage = `RangeError: Maximum call stack size exceeded

  10 | result.push(...treeToArray(child))
     |        ^

    at treeToArray (editorWorkerMain.js:10:8)`
  const info = GetEditorErrorInfo.getEditorErrorInfo(error, preparedMessage)
  expect(info).toEqual({
    type: EditorErrorType.Error,
    message: preparedMessage,
    actions: [],
  })
})
