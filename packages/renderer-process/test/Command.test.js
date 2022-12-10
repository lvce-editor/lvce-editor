import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ModuleMap/ModuleMap.js', () => {
  return {
    getModuleId: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Command = await import('../src/parts/Command/Command.js')
const ModuleMap = await import('../src/parts/ModuleMap/ModuleMap.js')

class NoErrorThrownError extends Error {}

/**
 *
 * @param {any} promise
 * @returns {Promise<Error>}
 *  */
const getError = async (promise) => {
  try {
    await promise
    throw new NoErrorThrownError()
  } catch (error) {
    // @ts-ignore
    return error
  }
}

test('register', () => {
  const mockFn = jest.fn()
  Command.register(-12, mockFn)
  expect(Command.state.commands[-12]).toBe(mockFn)
})

test('execute - command already registered', async () => {
  const mockFn = jest.fn()
  Command.register(-12, mockFn)
  await Command.execute(-12, 'abc')
  expect(mockFn).toHaveBeenCalledTimes(1)
  expect(mockFn).toBeCalledWith('abc')
})

test('execute - command already registered but throws error', async () => {
  const mockFn = jest.fn(() => {
    throw new Error('Oops')
  })
  Command.register(-12, mockFn)
  expect(() => Command.execute(-12, 'abc')).toThrowError(new Error('Oops'))
})

test('execute - error - module has syntax error', async () => {
  // @ts-ignore
  ModuleMap.getModuleId.mockImplementation(() => {
    return 21
  })
  Command.state.load = async () => {
    const error = new SyntaxError(`Unexpected token ','`)
    error.stack = `SyntaxError: Unexpected token ','`
    throw error
  }
  const error = await getError(Command.execute('test.test'))
  expect(error.message).toBe(
    `Failed to load command test.test: VError: failed to load module 21: SyntaxError: Unexpected token ','`
  )
  const lines = error.stack.split('\n')
  expect(lines[0]).toBe(
    `VError: Failed to load command test.test: VError: failed to load module 21: SyntaxError: Unexpected token ','`
  )
  expect(lines[2]).toMatch(`  at loadCommand`)
})
