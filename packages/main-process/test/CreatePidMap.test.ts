import { jest } from '@jest/globals'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.resetModules()
  jest.resetAllMocks()
})

jest.unstable_mockModule('electron', () => {
  return {
    BrowserWindow: {
      getAllWindows: jest.fn(() => {
        throw new Error('not implemented')
      }),
    },
  }
})

const CreatePidMap = await import('../src/parts/CreatePidMap/CreatePidMap.js')
const electron = await import('electron')

test('createPidMap - detect chrome devtools', () => {
  // @ts-ignore
  electron.BrowserWindow.getAllWindows.mockImplementation(() => {
    return [
      {
        webContents: {
          getOSProcessId() {
            return 123
          },
          devToolsWebContents: {
            getOSProcessId() {
              return 200152
            },
          },
        },
        getBrowserViews() {
          return []
        },
      },
    ]
  })
  expect(CreatePidMap.createPidMap()).toEqual({ 123: 'renderer', 200152: 'chrome-devtools' })
})

test('createPidMap - detect renderer', () => {
  // @ts-ignore
  electron.BrowserWindow.getAllWindows.mockImplementation(() => {
    return [
      {
        webContents: {
          getOSProcessId() {
            return 200152
          },
        },
        getBrowserViews() {
          return []
        },
      },
    ]
  })
  expect(CreatePidMap.createPidMap()).toEqual({
    200152: 'renderer',
  })
})

test('createPidMap - unknown renderer', () => {
  // @ts-ignore
  electron.BrowserWindow.getAllWindows.mockImplementation(() => {
    return []
  })
  expect(CreatePidMap.createPidMap()).toEqual({})
})
