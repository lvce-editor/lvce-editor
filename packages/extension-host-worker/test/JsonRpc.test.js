import { jest } from '@jest/globals'
import * as Callback from '../src/parts/Callback/Callback.js'
import * as JsonRpc from '../src/parts/JsonRpc/JsonRpc.js'
import { JsonRpcError } from '../src/parts/JsonRpcError/JsonRpcError.js'

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

test('invoke - unexpected response message', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          x: 42,
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error).toBeInstanceOf(JsonRpcError)
  expect(error.message).toBe(`unexpected response message`)
})
