import { jest } from '@jest/globals'
import { BabelParseError } from '../src/parts/BabelParseError/BabelParseError.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ImportScript/ImportScript.js', () => {
  return {
    importScript: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ImportScript = await import('../src/parts/ImportScript/ImportScript.js')
const ImportTest = await import('../src/parts/ImportTest/ImportTest.js')

test('importTest', async () => {
  // @ts-ignore
  ImportScript.importScript.mockImplementation((url) => {
    throw new BabelParseError(url, { message: 'Missing semicolon. (22:1)', loc: { line: 22, column: 1 } })
  })
  await expect(ImportTest.importTest('/test/test.js')).rejects.toThrowError(new Error('Failed to import test: BabelParseError: Missing semicolon.'))
})
