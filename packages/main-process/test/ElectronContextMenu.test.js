jest.mock('electron', () => {
  return {
    clipboard: {
      writeText: jest.fn(),
    },
  }
})

const ElectronClipBoard = require('../src/parts/ElectronClipBoard/ElectronClipBoard.js')

const electron = require('electron')

test('writeText', () => {
  // @ts-ignore
  electron.clipboard.writeText.mockImplementation(() => {})
  ElectronClipBoard.writeText('abc')
  expect(electron.clipboard.writeText).toHaveBeenCalledTimes(1)
  expect(electron.clipboard.writeText).toHaveBeenCalledWith('abc')
})

test('writeText - error', () => {
  // @ts-ignore
  electron.clipboard.writeText.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(() => ElectronClipBoard.writeText('abc')).toThrowError(
    new TypeError('x is not a function')
  )
})
