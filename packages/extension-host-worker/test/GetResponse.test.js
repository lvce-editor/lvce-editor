import { jest } from '@jest/globals'
import { CommandNotFoundError } from '../src/parts/CommandNotFoundError/CommandNotFoundError.js'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const GetResponse = await import('../src/parts/GetResponse/GetResponse.js')

test('getResponse - error - method not found', async () => {
  // @ts-ignore
  const fn = (id) => {
    throw new CommandNotFoundError(id)
  }
  expect(
    await GetResponse.getResponse(
      {
        jsonrpc: JsonRpcVersion.Two,
        method: 'test.not-found',
        params: [],
        id: 1,
      },
      fn
    )
  ).toEqual({
    jsonrpc: JsonRpcVersion.Two,
    id: 1,
    error: {
      code: -32601,
      data: expect.stringMatching('CommandNotFoundError: Command test.not-found not found'),
      message: 'Command test.not-found not found',
    },
  })
})
