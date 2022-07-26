const electron = require('electron')
const ListProcessGetName = require('../src/parts/ListProcessGetName/ListProcessGetName.js')

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

test('getName - detect chrome devtools', () => {
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
      },
    ]
  })
  expect(
    ListProcessGetName.getName(
      200152,
      'packages/main-process/node_modules/electron/dist/electron --type=renderer --enable-crashpad --enable-crash-reporter=d476773f-ae60-4c60-85c5-d4f2eb675cee,no_channel --user-data-dir=/test.config/main-process --standard-schemes=lvce-oss --enable-sandbox --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path=/packages/main-process --lang=en-US --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=7 --launch-time-ticks=6086771284 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=0,i,17047493330214191737,6951987383812573163,131072 --disable-features=SpareRendererForSitePerProcess',
      1
    )
  ).toBe('chrome-devtools')
})

test('getName - detect renderer', () => {
  // @ts-ignore
  electron.BrowserWindow.getAllWindows.mockImplementation(() => {
    return [
      {
        webContents: {
          getOSProcessId() {
            return 200152
          },
        },
      },
    ]
  })
  expect(
    ListProcessGetName.getName(
      200152,
      '/packages/main-process/node_modules/electron/dist/electron --type=renderer --enable-crashpad --enable-crash-reporter=d476773f-ae60-4c60-85c5-d4f2eb675cee,no_channel --user-data-dir=/test.config/main-process --standard-schemes=lvce-oss --enable-sandbox --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path=/packages/main-process --lang=en-US --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=7 --launch-time-ticks=6086771284 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=0,i,17047493330214191737,6951987383812573163,131072 --disable-features=SpareRendererForSitePerProcess',
      1
    )
  ).toBe('renderer')
})

test('getName - unknown renderer', () => {
  // @ts-ignore
  electron.BrowserWindow.getAllWindows.mockImplementation(() => {
    return []
  })
  expect(
    ListProcessGetName.getName(
      200152,
      '/packages/main-process/node_modules/electron/dist/electron --type=renderer --enable-crashpad --enable-crash-reporter=d476773f-ae60-4c60-85c5-d4f2eb675cee,no_channel --user-data-dir=/test.config/main-process --standard-schemes=lvce-oss --enable-sandbox --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path=/packages/main-process --lang=en-US --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=7 --launch-time-ticks=6086771284 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=0,i,17047493330214191737,6951987383812573163,131072 --disable-features=SpareRendererForSitePerProcess',
      1
    )
  ).toBe('<unknown renderer>')
})
