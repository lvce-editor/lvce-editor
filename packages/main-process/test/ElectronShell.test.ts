import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('electron', () => {
  return {
    shell: {
      showItemInFolder: jest.fn(),
      beep: jest.fn(),
      openExternal: jest.fn(),
      openPath: jest.fn(),
    },
  }
})

const electron = await import('electron')
const ElectronShell = await import('../src/parts/ElectronShell/ElectronShell.js')

test.skip('showItemInFolder', () => {
  // @ts-expect-error
  electron.shell.showItemInFolder.mockImplementation(() => {})
  ElectronShell.showItemInFolder('/test/file.txt')
  expect(electron.shell.showItemInFolder).toHaveBeenCalledTimes(1)
  expect(electron.shell.showItemInFolder).toHaveBeenCalledWith('/test/file.txt')
})

test.skip('beep', () => {
  // @ts-expect-error
  electron.shell.beep.mockImplementation(() => {})
  ElectronShell.beep()
  expect(electron.shell.beep).toHaveBeenCalledTimes(1)
  expect(electron.shell.beep).toHaveBeenCalledWith()
})

test.skip('openExternal', async () => {
  // @ts-expect-error
  electron.shell.openExternal.mockImplementation(() => {})
  await ElectronShell.openExternal('https://example.com')
  expect(electron.shell.openExternal).toHaveBeenCalledTimes(1)
  expect(electron.shell.openExternal).toHaveBeenCalledWith('https://example.com')
})

test.skip('openPath', async () => {
  // @ts-expect-error
  electron.shell.openPath.mockImplementation(() => {})
  await ElectronShell.openPath('/test/file.txt')
  expect(electron.shell.openPath).toHaveBeenCalledTimes(1)
  expect(electron.shell.openPath).toHaveBeenCalledWith('/test/file.txt')
})
