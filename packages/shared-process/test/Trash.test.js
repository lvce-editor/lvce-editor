import { jest } from '@jest/globals'

afterEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('trash', () => {
  return {
    default: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const trash = await import('trash')
const Trash = await import('../src/parts/Trash/Trash.js')

test('trash', async () => {
  // @ts-ignore
  trash.default.mockImplementation(() => {})
  await Trash.trash('/test')
  expect(trash.default).toHaveBeenCalledTimes(1)
  expect(trash.default).toHaveBeenCalledWith('/test')
})

test('trash - error', async () => {
  // @ts-ignore
  trash.default.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(Trash.trash('/test')).rejects.toThrowError(
    new Error('Failed to move item to trash: x is not a function')
  )
})
