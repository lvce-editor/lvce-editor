import { jest } from '@jest/globals'
import * as BrowserWindow from '../src/parts/ElectronWindow/ElectronWindow.js'

// TODO how to test window (highly depends on electron)
test.skip('toggleDevtools', () => {
  // Window.toggleDevtools()
})

test('focus', () => {
  const browserWindow = {
    webContents: {
      focus: jest.fn(),
    },
  }
  // @ts-ignore
  BrowserWindow.focus(browserWindow)
  expect(browserWindow.webContents.focus).toHaveBeenCalledTimes(1)
})
