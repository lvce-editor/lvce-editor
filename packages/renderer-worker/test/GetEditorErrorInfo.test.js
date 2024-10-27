import { expect, test } from '@jest/globals'
import * as GetEditorErrorInfo from '../src/parts/GetEditorErrorinfo/GetEditorErrorInfo.js'

test('error - not found', async () => {
  const error = {
    code: 'ENOENT',
    message: 'file not found',
  }
  const info = GetEditorErrorInfo.getEditorErrorInfo(error)
  expect(info).toEqual({
    type: 'error',
    message: 'file not found',
    actions: [
      {
        name: 'Create File',
      },
    ],
  })
})

test('error - other', async () => {
  const error = new TypeError(`x is not a function`)
  const info = GetEditorErrorInfo.getEditorErrorInfo(error)
  expect(info).toEqual({
    type: 'error',
    message: 'TypeError: x is not a function',
    actions: [],
  })
})
