beforeEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

jest.mock('../src/parts/AppWindowStates/AppWindowStates.js', () => {
  return {
    state: {
      windows: [],
    },
    add: jest.fn(),
  }
})

jest.mock('electron', () => {
  const EventEmitter = require('events')
  return {
    session: {
      fromPartition() {
        return {
          webRequest: {
            onHeadersReceived() {},
          },
          protocol: {
            registerFileProtocol() {},
          },
          setPermissionRequestHandler() {},
          setPermissionCheckHandler() {},
        }
      },
    },
    screen: {
      getPrimaryDisplay() {
        return {
          bounds: {
            width: 10,
            height: 10,
          },
        }
      },
    },
    BrowserWindow: class extends EventEmitter {
      async loadURL() {
        throw new Error(`ERR_FAILED (-2) loading 'lvce-oss://-'`)
      }
    },
  }
})

const AppWindowStates = require('../src/parts/AppWindowStates/AppWindowStates.js')

const AppWindow = require('../src/parts/AppWindow/AppWindow.js')
const electron = require('electron')
const { EventEmitter } = require('node:events')

test('createAppWindow', async () => {
  // @ts-ignore
  electron.BrowserWindow = class extends EventEmitter {
    async loadURL() {}
  }
  await AppWindow.createAppWindow([], '')
  expect(AppWindowStates.add).toHaveBeenCalledTimes(1)
})

test('createAppWindow - error', async () => {
  // @ts-ignore
  electron.BrowserWindow = class extends EventEmitter {
    async loadURL() {
      throw new Error(`ERR_FAILED (-2) loading 'lvce-oss://-'`)
    }
  }
  // TODO error message should be improved
  await expect(AppWindow.createAppWindow([], '')).rejects.toThrowError(
    new Error(
      'Failed to load window url "lvce-oss://-": ERR_FAILED (-2) loading \'lvce-oss://-\''
    )
  )
})
