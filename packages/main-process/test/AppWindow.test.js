beforeEach(() => {
  jest.resetModules()
})

afterEach(() => {
  require('../src/parts/AppWindow/AppWindow.js').state.windows = []
})

test('createAppWindow', async () => {
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
        async loadURL() {}
      },
    }
  })
  const AppWindow = require('../src/parts/AppWindow/AppWindow.js')
  await AppWindow.createAppWindow([], '')
  expect(AppWindow.state.windows).toHaveLength(1)
})

test('createAppWindow - error', async () => {
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
  const AppWindow = require('../src/parts/AppWindow/AppWindow.js')
  // TODO error message should be improved
  await expect(AppWindow.createAppWindow([], '')).rejects.toThrowError(
    new Error(
      "Failed to load window url (phase 0): ERR_FAILED (-2) loading 'lvce-oss://-'"
    )
  )
})
