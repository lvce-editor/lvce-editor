import { jest, beforeEach, test, expect } from '@jest/globals'

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

const LoadFile = await import('../src/parts/LoadFile/LoadFile.js')
const ImportScript = await import('../src/parts/ImportScript/ImportScript.js')

test('loadFile - error - invalid module specifier', async () => {
  // @ts-ignore
  ImportScript.importScript.mockRejectedValue(
    new Error(
      'Failed to load /css-worker/src/cssWorkerMain.js: TypeError: Failed to resolve module specifier "url". Relative references must start with either "/", "./", or "../".',
    ),
  )
  await expect(LoadFile.loadFile('/css-worker/src/cssWorkerMain.js')).rejects.toThrow(
    new Error(
      'Failed to load /css-worker/src/cssWorkerMain.js: TypeError: Failed to resolve module specifier "url". Relative references must start with either "/", "./", or "../".',
    ),
  )
})
