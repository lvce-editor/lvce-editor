import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FunctionFromString/FunctionFromString.js', () => {
  return {
    create: jest.fn(() => {
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
const FunctionFromString = await import('../src/parts/FunctionFromString/FunctionFromString.js')
const Api = await import('../src/parts/Api/Api.js')

test('mockExec - content security policy error', () => {
  // @ts-ignore
  FunctionFromString.create.mockImplementation(() => {
    throw new EvalError(
      `Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: "script-src 'self'".`
    )
  })
  expect(() => ExtensionHostMockExec.mockExec('() => {}')).toThrowError(
    new Error(
      "Failed to mock exec function: EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script in the following Content Security Policy directive: \"script-src 'self'\"."
    )
  )
})

test('mockExec', async () => {
  const mockFunction = jest.fn(() => {
    return {
      stdout: '',
      stderr: '',
      exitCode: 0,
    }
  })
  // @ts-ignore
  FunctionFromString.create.mockImplementation(() => {
    return mockFunction
  })
  ExtensionHostMockExec.mockExec('() => {}')
  expect(FunctionFromString.create).toHaveBeenCalledTimes(1)
  expect(FunctionFromString.create).toHaveBeenCalledWith('() => {}')
  expect(await Api.api.exec('test')).toEqual({
    stdout: '',
    stderr: '',
    exitCode: 0,
  })
  expect(mockFunction).toHaveBeenCalledTimes(1)
  expect(mockFunction.name).toBe('mockExec')
})
