/* eslint-disable jest/no-restricted-jest-methods -- Error preparation tests use ESM module mocks for worker dependencies. */
import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()
const getTokenizePath = jest.fn<(languageId: string) => string>(() => '/tokenize-javascript.js')

beforeEach(() => {
  jest.resetAllMocks()
  getTokenizePath.mockReturnValue('/tokenize-javascript.js')
})

jest.unstable_mockModule('../src/parts/ErrorWorker/ErrorWorker.ts', () => ({
  invoke,
}))

jest.unstable_mockModule('../src/parts/GetTokenizePath/GetTokenizePath.js', () => ({
  getTokenizePath,
}))

const PrettyError = await import('../src/parts/PrettyError/PrettyError.js')

test('prepare passes the javascript tokenizer path to the error worker', async () => {
  const error = new TypeError('Oops')
  const prepared = {
    message: 'TypeError: Oops',
    syntaxHighlightedCodeFrame: [],
  }
  invoke.mockResolvedValue(prepared)

  expect(await PrettyError.prepare(error)).toBe(prepared)
  expect(getTokenizePath).toHaveBeenCalledWith('javascript')
  expect(invoke).toHaveBeenCalledWith(
    'Errors.prepare',
    {
      code: undefined,
      codeFrame: undefined,
      constructor: {
        name: 'TypeError',
      },
      message: 'Oops',
      name: 'TypeError',
      stack: error.stack,
    },
    {
      tokenizerPath: '/tokenize-javascript.js',
    },
  )
})

test('prepare returns the original error when preparation fails', async () => {
  const error = new Error('Oops')
  invoke.mockRejectedValue(new Error('Worker failed'))

  expect(await PrettyError.prepare(error)).toBe(error)
})
