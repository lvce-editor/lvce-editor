import { expect, test } from '@jest/globals'
import * as GetErrorResponse from '../src/parts/GetErrorResponse/GetErrorResponse.ts'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.ts'

test('getErrorResponse - null', () => {
  const message = {
    id: 1,
  }
  const error = null
  const responseMessage = GetErrorResponse.getErrorResponse(message, error)
  expect(responseMessage).toMatchObject({
    error: {
      message: 'null',
      name: 'NonError',
      stack: expect.stringMatching('NonError: null'),
    },
    id: 1,
    jsonrpc: JsonRpcVersion.Two,
  })
})
