beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('electron', () => {
  return {
    BrowserWindow: {},
  }
})

const ElectronBrowserViewFunctions = require('../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js')

test('focus', async () => {
  const view = {
    webContents: {
      focus: jest.fn(),
    },
  }
  // @ts-ignore
  ElectronBrowserViewFunctions.focus(view)
  expect(view.webContents.focus).toHaveBeenCalledTimes(1)
})

test('openDevTools', async () => {
  const view = {
    webContents: {
      openDevTools: jest.fn(),
    },
  }
  // @ts-ignore
  ElectronBrowserViewFunctions.openDevtools(view)
  expect(view.webContents.openDevTools).toHaveBeenCalledTimes(1)
})
