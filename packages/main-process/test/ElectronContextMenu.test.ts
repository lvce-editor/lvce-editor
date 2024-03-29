import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('electron', () => {
  return {
    clipboard: {
      writeText: jest.fn(),
    },
  }
})

const electron = await import('electron')
const ElectronClipBoard = await import('../src/parts/ElectronClipBoard/ElectronClipBoard.js')

test('writeText', () => {
  // @ts-expect-error
  electron.clipboard.writeText.mockImplementation(() => {})
  ElectronClipBoard.writeText('abc')
  expect(electron.clipboard.writeText).toHaveBeenCalledTimes(1)
  expect(electron.clipboard.writeText).toHaveBeenCalledWith('abc')
})

test('writeText - error', () => {
  // @ts-expect-error
  electron.clipboard.writeText.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(() => {
    ElectronClipBoard.writeText('abc')
  }).toThrow(new TypeError('x is not a function'))
})
