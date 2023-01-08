import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Api/Api.js', () => {
  return {
    api: {
      exec: jest.fn(),
    },
  }
})

const ExtensionHostMockExec = await import('../src/parts/ExtensionHostMockExec/ExtensionHostMockExec.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')
const Api = await import('../src/parts/Api/Api.js')

test('mockExec', async () => {
  // @ts-ignore
  JsonRpc.invoke.mockImplementation(() => {
    return {
      stdout: '',
      stderr: '',
      exitCode: 0,
    }
  })

  ExtensionHostMockExec.mockExec()
  expect(await Api.api.exec('test')).toEqual({
    stdout: '',
    stderr: '',
    exitCode: 0,
  })
  expect(JsonRpc.invoke).toHaveBeenCalledTimes(1)
  expect(JsonRpc.invoke).toHaveBeenCalledWith(undefined, 'Test.executeMockExecFunction', 'test', undefined, undefined)
})
