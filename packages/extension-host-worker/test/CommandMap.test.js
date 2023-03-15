import * as CommandMap from '../src/parts/CommandMap/CommandMap.js'
import { CommandNotFoundError } from '../src/parts/CommandNotFoundError/CommandNotFoundError.js'

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

test('getFn', async () => {
  const error = await getError(() => CommandMap.getFn('test.not-found'))
  expect(error).toBeInstanceOf(CommandNotFoundError)
  expect(error.message).toBe('Command test.not-found not found')
})
