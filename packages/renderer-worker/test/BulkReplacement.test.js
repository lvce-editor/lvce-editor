import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

const BulkReplacement = await import('../src/parts/BulkReplacement/BulkReplacement.js')

test('applyBulkReplacement', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await BulkReplacement.applyBulkReplacement(['/test/file.txt'], [4, 0, 0, 0, 1], 'b')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('BulkReplacement.applyBulkReplacement', ['/test/file.txt'], [4, 0, 0, 0, 1], 'b')
})
