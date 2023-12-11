import EventEmitter from 'node:events'
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/AppWindowStates/AppWindowStates.js', () => {
  return {
    state: {
      windows: [],
    },
    add: jest.fn(),
  }
})

jest.unstable_mockModule('electron', () => {
  const BrowserWindow = class extends EventEmitter {
    constructor() {
      super()
      this.webContents = {
        id: 1,
      }
    }
  }
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
            handle() {},
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
    net: {},
    Menu: class {},
  }
})

const electron = await import('electron')
const AppWindowStates = await import('../src/parts/AppWindowStates/AppWindowStates.js')
const AppWindow = await import('../src/parts/AppWindow/AppWindow.js')

test.skip('createAppWindow', async () => {
  // @ts-ignore
  electron.BrowserWindow.prototype.loadURL.mockImplementation(() => {})
  await AppWindow.createAppWindow([], '')
  expect(AppWindowStates.add).toHaveBeenCalledTimes(1)
})

test.skip('createAppWindow - error', async () => {
  // @ts-ignore
  electron.BrowserWindow.prototype.loadURL.mockImplementation(() => {
    throw new Error(`ERR_FAILED (-2) loading 'lvce-oss://-/'`)
  })
  // TODO error message should be improved
  await expect(AppWindow.createAppWindow([], '')).rejects.toThrowError(
    new Error("Failed to load url lvce-oss://-/: ERR_FAILED (-2) loading 'lvce-oss://-/'"),
  )
})
