import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  // @ts-ignore
  globalThis.fetch = jest.fn()
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/TryToGetActualErrorMessageWhenNetworkRequestSucceeds/TryToGetActualErrorMessageWhenNetworkRequestSucceeds.ts',
  () => ({
    tryToGetActualErrorMessage: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }),
)

const TryToGetActualWorkerErrorMessage = await import('../src/parts/TryToGetActualWorkerErrorMessage/TryToGetActualWorkerErrorMessage.ts')
const TryToGetActualErrorMessageWhenNetworkRequestSucceeds = await import(
  '../src/parts/TryToGetActualErrorMessageWhenNetworkRequestSucceeds/TryToGetActualErrorMessageWhenNetworkRequestSucceeds.ts'
)

test('getActualErrorMessage - missing content type header', async () => {
  const url = '/test/file.ts'
  const name = 'test worker'
  // @ts-ignore
  globalThis.fetch = () => {
    return new Response('', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
  expect(await TryToGetActualWorkerErrorMessage.tryToGetActualErrorMessage({ url, name })).toBe(
    `Failed to start test worker: Content type for worker must be application/javascript but is text/plain`,
  )
})

test('getActualErrorMessage - cross origin embedder policy header missing', async () => {
  const url = '/test/file.ts'
  const name = 'test worker'
  // @ts-ignore
  globalThis.fetch = () => {
    return new Response('', {
      status: 200,
      headers: {
        'Content-Type': 'text/javascript',
      },
    })
  }
  expect(await TryToGetActualWorkerErrorMessage.tryToGetActualErrorMessage({ url, name })).toBe(
    `Failed to start test worker: Cross Origin Embedder Policy header is missing`,
  )
})

test('getActualErrorMessage - cross origin embedder policy has wrong value', async () => {
  const url = '/test/file.ts'
  const name = 'test worker'
  // @ts-ignore
  globalThis.fetch = () => {
    return new Response('', {
      status: 200,
      headers: {
        'Content-Type': 'text/javascript',
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
      },
    })
  }
  expect(await TryToGetActualWorkerErrorMessage.tryToGetActualErrorMessage({ url, name })).toBe(
    `Failed to start test worker: Cross Origin Embedder Policy has wrong value`,
  )
})

test('getActualErrorMessage - content type text/javascript - other error', async () => {
  const url = '/test/file.ts'
  const name = 'test worker'
  // @ts-ignore
  globalThis.fetch = () => {
    return new Response('', {
      status: 200,
      headers: {
        'Content-Type': 'text/javascript',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    })
  }
  // @ts-ignore
  TryToGetActualErrorMessageWhenNetworkRequestSucceeds.tryToGetActualErrorMessage.mockImplementation(() => {
    return 'Network error'
  })
  expect(await TryToGetActualWorkerErrorMessage.tryToGetActualErrorMessage({ url, name })).toBe(`Network error`)
})
