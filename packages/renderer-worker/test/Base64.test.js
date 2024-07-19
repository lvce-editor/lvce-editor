import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/LoadJsBase64/LoadJsBase64.js', () => {
  const decode = jest.fn()
  return {
    loadJsBase64() {
      return {
        decode,
      }
    },
  }
})

const Base64 = await import('../src/parts/Base64/Base64.js')
const LoadJsBase64 = await import('../src/parts/LoadJsBase64/LoadJsBase64.js')

test('decode', async () => {
  const jsBase64 = await LoadJsBase64.loadJsBase64()
  jsBase64.decode.mockImplementation(() => 'abc')
  expect(await Base64.decode('YWJj')).toBe('abc')
  expect(jsBase64.decode).toHaveBeenCalledTimes(1)
  expect(jsBase64.decode).toHaveBeenCalledWith('YWJj')
})
