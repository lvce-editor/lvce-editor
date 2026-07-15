import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/OpenUri/OpenUri.js', () => {
  return {
    openUri: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const OpenUri = await import('../src/parts/OpenUri/OpenUri.js')
const ProcessExplorer = await import('../src/parts/ProcessExplorer/ProcessExplorer.js')

test('open', async () => {
  // @ts-ignore
  OpenUri.openUri.mockResolvedValue(undefined)

  await ProcessExplorer.open()

  expect(OpenUri.openUri).toHaveBeenCalledTimes(1)
  expect(OpenUri.openUri).toHaveBeenCalledWith('process-explorer://')
})
