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
jest.mock(
  '../src/parts/ElectronApplicationMenu/ElectronApplicationMenu.js',
  () => {
    return {
      createTitleBar: jest.fn(),
      setItems: jest.fn(),
      setMenu: jest.fn(),
    }
  }
)

jest.mock('electron', () => {
  const EventEmitter = require('node:events')
  const BrowserWindow = class extends EventEmitter {}
  BrowserWindow.prototype.loadURL = jest.fn()
  BrowserWindow.prototype.setMenuBarVisibility = jest.fn()
  BrowserWindow.prototype.setAutoHideMenuBar = jest.fn()
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
    BrowserWindow,
  }
})

const electron = require('electron')
const AppWindowStates = require('../src/parts/AppWindowStates/AppWindowStates.js')

const AppWindow = require('../src/parts/AppWindow/AppWindow.js')

test('createAppWindow', async () => {
  // @ts-ignore
  electron.BrowserWindow.prototype.loadURL.mockImplementation(() => {})
  await AppWindow.createAppWindow([], '')
  expect(AppWindowStates.add).toHaveBeenCalledTimes(1)
})

test('createAppWindow - error', async () => {
  // @ts-ignore
  electron.BrowserWindow.prototype.loadURL.mockImplementation(() => {
    throw new Error(`ERR_FAILED (-2) loading 'lvce-oss://-'`)
  })
  // TODO error message should be improved
  await expect(AppWindow.createAppWindow([], '')).rejects.toThrowError(
    new Error(
      'Failed to load window url "lvce-oss://-": ERR_FAILED (-2) loading \'lvce-oss://-\''
    )
  )
})
