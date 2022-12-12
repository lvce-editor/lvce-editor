import { jest } from '@jest/globals'
import { CommandNotFoundError } from '../src/parts/Errors/Errors.js'

beforeEach(() => {
  jest.resetAllMocks()
})

const Command = await import('../src/parts/Command/Command.js')

class NoErrorThrownError extends Error {}

/**
 *
 * @param {any} fn
 * @returns {Promise<Error>}
 *  */
const getError = async (fn) => {
  try {
    await fn()
    throw new NoErrorThrownError()
  } catch (error) {
    // @ts-ignore
    return error
  }
}

test('execute - error - command not found', async () => {
  const error = await getError(() => Command.execute('test.not-found'))
  expect(error).toBeInstanceOf(CommandNotFoundError)
  expect(error.message).toBe(`method not found: test.not-found`)
})
