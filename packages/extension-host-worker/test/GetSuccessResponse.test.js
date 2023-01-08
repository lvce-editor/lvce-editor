import * as GetSuccessResponse from '../src/parts/GetSuccessResponse/GetSuccessResponse.js'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'

test('getSuccessResponse - result is of type number', () => {
  const message = {
    id: 1,
  }
  const result = 123
  expect(GetSuccessResponse.getSuccessResponse(message, result)).toEqual({
    result: 123,
    id: 1,
    jsonrpc: JsonRpcVersion.Two,
  })
})
