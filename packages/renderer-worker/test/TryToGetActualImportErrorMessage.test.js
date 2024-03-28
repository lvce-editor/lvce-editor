import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

beforeAll(() => {
  // @ts-ignore
  globalThis.fetch = jest.fn()
})

const TryToGetActualImportErrorMessage = await import('../src/parts/TryToGetActualImportErrorMessage/TryToGetActualImportErrorMessage.js')

test('tryToGetActualImportErrorMessage - ReferenceError', async () => {
  const error = new ReferenceError('test is not defined')
  error.stack = '    at http://localhost:3000/packages/extension-host-worker-tests/src/sample.brace-completion-provider-error-spelling.js:3:1'
  const url = 'src/sample.brace=completion-provider-error-spelling.js'
  expect(await TryToGetActualImportErrorMessage.tryToGetActualImportErrorMessage(url, error)).toBe(
    'Failed to import script: ReferenceError: test is not defined',
  )
})
