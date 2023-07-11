import * as LoadErrorCode from '../src/parts/LoadErrorCode/LoadErrorCode.js'
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('electron', () => {
  return {
    BrowserWindow: {},
  }
})

const ElectronBrowserViewFunctions = await import('../src/parts/ElectronBrowserViewFunctions/ElectronBrowserViewFunctions.js')

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

test('inspectElement', async () => {
  const view = {
    webContents: {
      inspectElement: jest.fn(),
    },
  }
  // @ts-ignore
  ElectronBrowserViewFunctions.inspectElement(view, 0, 0)
  expect(view.webContents.inspectElement).toHaveBeenCalledTimes(1)
  expect(view.webContents.inspectElement).toBeCalledWith(0, 0)
})

class LoadError extends Error {
  constructor(code, message = code) {
    super(code + ':' + message)
    this.code = code
  }
}

test('setIframeSrc', async () => {
  const view = {
    webContents: {
      loadURL: jest.fn(),
      loadFile: jest.fn(),
      getTitle() {
        return ''
      },
    },
  }
  // @ts-ignore
  await ElectronBrowserViewFunctions.setIframeSrc(view, 'https://example.com')
  expect(view.webContents.loadURL).toHaveBeenCalledTimes(1)
  expect(view.webContents.loadURL).toBeCalledWith('https://example.com')
})

test('setIframeSrc - error - connection refused', async () => {
  const view = {
    webContents: {
      loadURL: jest.fn(() => {
        throw new LoadError(LoadErrorCode.ERR_CONNECTION_REFUSED)
      }),
      loadFile: jest.fn(),
      getTitle() {
        return ''
      },
    },
  }
  // @ts-ignore
  await ElectronBrowserViewFunctions.setIframeSrc(view, 'https://example.com')
  expect(view.webContents.loadURL).toHaveBeenCalledTimes(1)
  expect(view.webContents.loadURL).toBeCalledWith('https://example.com')
  expect(view.webContents.loadFile).toHaveBeenCalledTimes(1)
  expect(view.webContents.loadFile).toHaveBeenCalledWith(expect.stringContaining('error.html'), {
    query: {
      code: LoadErrorCode.ERR_CONNECTION_REFUSED,
    },
  })
})

test('setIframeSrc - error - canceled', async () => {
  const view = {
    webContents: {
      loadURL: jest.fn(() => {
        throw new LoadError(LoadErrorCode.ERR_CONNECTION_REFUSED)
      }),
      loadFile: jest.fn(),
      getTitle() {
        return ''
      },
    },
  }
  // @ts-ignore
  await ElectronBrowserViewFunctions.setIframeSrc(view, 'https://example.com')
  expect(view.webContents.loadURL).toHaveBeenCalledTimes(1)
  expect(view.webContents.loadURL).toBeCalledWith('https://example.com')
  expect(view.webContents.loadFile).toHaveBeenCalledTimes(1)
  expect(view.webContents.loadFile).toHaveBeenCalledWith(expect.stringContaining('error.html'), {
    query: {
      code: LoadErrorCode.ERR_CONNECTION_REFUSED,
    },
  })
})

test('setIframeSrc - error - aborted', async () => {
  const view = {
    webContents: {
      loadURL: jest.fn(() => {
        throw new LoadError(LoadErrorCode.ERR_ABORTED)
      }),
      loadFile: jest.fn(),
      getTitle() {
        return ''
      },
    },
  }
  // @ts-ignore
  await ElectronBrowserViewFunctions.setIframeSrc(view, 'https://example.com')
  expect(view.webContents.loadFile).not.toHaveBeenCalled()
})

test('setIframeSrc - two errors', async () => {
  const view = {
    webContents: {
      loadURL: jest.fn(() => {
        throw new LoadError(LoadErrorCode.ERR_CONNECTION_REFUSED)
      }),
      loadFile: jest.fn(() => {
        throw new LoadError(LoadErrorCode.ERR_CONNECTION_REFUSED)
      }),
      getTitle() {
        return ''
      },
    },
  }
  await expect(
    // @ts-ignore
    ElectronBrowserViewFunctions.setIframeSrc(view, 'https://example.com')
  ).rejects.toThrowError(new Error('Failed to set iframe src: ERR_CONNECTION_REFUSED:ERR_CONNECTION_REFUSED'))
})
