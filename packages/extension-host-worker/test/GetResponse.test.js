import { jest } from '@jest/globals'
import { CommandNotFoundError } from '../src/parts/Errors/Errors.js'

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

const Command = await import('../src/parts/Command/Command.js')
const GetResponse = await import('../src/parts/GetResponse/GetResponse.js')

test('getResponse - error - method not found', async () => {
  // @ts-ignore
  Command.execute.mockImplementation((id) => {
    throw new CommandNotFoundError(`method ${id} not found`)
  })
  expect(
    await GetResponse.getResponse({
      jsonrpc: '2.0',
      method: 'test.not-found',
      params: [],
      id: 1,
    })
  ).toEqual({
    jsonrpc: '2.0',
    id: 1,
    error: {
      code: -32601,
      data: expect.stringMatching(
        'CommandNotFoundError: method test.not-found not found'
      ),
      message: 'method test.not-found not found',
    },
  })
})
