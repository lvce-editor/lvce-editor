import { beforeEach, expect, jest, test } from '@jest/globals'
import EventEmitter from 'node:events'

beforeEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

jest.unstable_mockModule('electron', () => {
  const BrowserWindow = class extends EventEmitter {
    constructor() {
      super()
      // @ts-ignore
      this.webContents = {
        id: 1,
      }
    }
  }
  // @ts-ignore
  BrowserWindow.prototype.loadURL = jest.fn()
  // @ts-ignore
  BrowserWindow.prototype.setMenuBarVisibility = jest.fn()
  // @ts-ignore
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
    MessageChannelMain: class {},
  }
})

const electron = await import('electron')
const AppWindow = await import('../src/parts/AppWindow/AppWindow.js')

test.skip('createAppWindow', async () => {
  // @ts-expect-error
  electron.BrowserWindow.prototype.loadURL.mockImplementation(() => {})
  // @ts-ignore
  // @ts-expect-error
  await AppWindow.createAppWindow([], '')
  // @ts-expect-error
  expect(AppWindowStates.add).toHaveBeenCalledTimes(1)
})

test.skip('createAppWindow - error', async () => {
  // @ts-expect-error
  electron.BrowserWindow.prototype.loadURL.mockImplementation(() => {
    throw new Error("ERR_FAILED (-2) loading 'lvce-oss://-/'")
  })
  // TODO error message should be improved
  // @ts-ignore
  // @ts-expect-error
  await expect(AppWindow.createAppWindow([], '')).rejects.toThrow(
    new Error("Failed to load url lvce-oss://-/: ERR_FAILED (-2) loading 'lvce-oss://-/'"),
  )
})
