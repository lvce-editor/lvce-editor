import { beforeEach, expect, jest, test } from '@jest/globals'
import { CommandNotFoundError } from '../src/parts/CommandNotFoundError/CommandNotFoundError.ts'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.ts', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const GetResponse = await import('../src/parts/GetResponse/GetResponse.ts')

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
      fn,
    ),
  ).toEqual({
    jsonrpc: JsonRpcVersion.Two,
    id: 1,
    error: {
      code: -32601,
      data: expect.stringMatching('CommandNotFoundError: Command "test.not-found" not found'),
      message: 'Command "test.not-found" not found (extension host worker)',
    },
  })
})
