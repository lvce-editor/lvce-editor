beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('electron', () => {
  return {
    shell: {
      showItemInFolder: jest.fn(),
      beep: jest.fn(),
      openExternal: jest.fn(),
    },
  }
})

const ElectronShell = require('../src/parts/ElectronShell/ElectronShell.js')

const electron = require('electron')

test('showItemInFolder', () => {
  // @ts-ignore
  electron.shell.showItemInFolder.mockImplementation(() => {})
  ElectronShell.showItemInFolder('/test/file.txt')
  expect(electron.shell.showItemInFolder).toHaveBeenCalledTimes(1)
  expect(electron.shell.showItemInFolder).toHaveBeenCalledWith('/test/file.txt')
})

test('beep', () => {
  // @ts-ignore
  electron.shell.beep.mockImplementation(() => {})
  ElectronShell.beep()
  expect(electron.shell.beep).toHaveBeenCalledTimes(1)
  expect(electron.shell.beep).toHaveBeenCalledWith()
})

test('openExternal', () => {
  // @ts-ignore
  electron.shell.openExternal.mockImplementation(() => {})
  ElectronShell.openExternal('https://example.com')
  expect(electron.shell.openExternal).toHaveBeenCalledTimes(1)
  expect(electron.shell.openExternal).toHaveBeenCalledWith(
    'https://example.com'
  )
})
