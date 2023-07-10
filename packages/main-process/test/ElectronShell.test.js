beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('electron', () => {
  return {
    shell: {
      showItemInFolder: jest.fn(),
      beep: jest.fn(),
      openExternal: jest.fn(),
      openPath: jest.fn(),
    },
  }
})

const electron = require('electron')
const ElectronShell = require('../src/parts/ElectronShell/ElectronShell.cjs')

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
  expect(electron.shell.openExternal).toHaveBeenCalledWith('https://example.com')
})

test('openPath', () => {
  // @ts-ignore
  electron.shell.openPath.mockImplementation(() => {})
  ElectronShell.openPath('/test/file.txt')
  expect(electron.shell.openPath).toHaveBeenCalledTimes(1)
  expect(electron.shell.openPath).toHaveBeenCalledWith('/test/file.txt')
})
