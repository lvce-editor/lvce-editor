const electron = require('electron')
const CreatePidMap = require('../src/parts/CreatePidMap/CreatePidMap.js')

beforeEach(() => {
  jest.restoreAllMocks()
  jest.resetModules()
  jest.resetAllMocks()
})

jest.mock('electron', () => {
  return {
    BrowserWindow: {
      getAllWindows: jest.fn(() => {
        throw new Error('not implemented')
      }),
    },
  }
})

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
