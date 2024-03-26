import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('open', () => {
  return {
    default: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const open = await import('open')
const Native = await import('../src/parts/OpenNativeFolder/OpenNativeFolder.js')

test('openFolder', async () => {
  // @ts-ignore
  open.default.mockImplementation(() => {})
  await Native.openFolder('/test')
  expect(open.default).toHaveBeenCalledTimes(1)
  expect(open.default).toHaveBeenCalledWith('/test')
})

test('openFolder - error', async () => {
  // @ts-ignore
  open.default.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // TODO should say that is is a TypeError
  await expect(Native.openFolder('/test')).rejects.toThrow(new Error('Failed to open /test: TypeError: x is not a function'))
})
