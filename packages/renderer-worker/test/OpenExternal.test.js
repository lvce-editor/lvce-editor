import { jest } from '@jest/globals'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

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
const OpenExternal = await import('../src/parts/OpenExternal/OpenExternal.js')

test('showItemInFolder - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(OpenExternal.showItemInFolder('/test/file.txt')).rejects.toThrow(new TypeError('x is not a function'))
})

test('showItemInFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  await OpenExternal.showItemInFolder('/test/file.txt')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('OpenExternal.showItemInFolder', '/test/file.txt')
})
