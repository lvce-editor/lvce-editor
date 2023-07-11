import { jest } from '@jest/globals'

beforeEach(() => {
  // @ts-ignore
  globalThis.fetch = jest.fn()
})

const TryToGetActualWorkerErrorMessage = await import('../src/parts/TryToGetActualWorkerErrorMessage/TryToGetActualWorkerErrorMessage.js')

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
    `Failed to start test worker: Content type for worker must be application/javascript`
  )
})
