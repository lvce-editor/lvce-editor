import { jest } from '@jest/globals'
import * as ElectronMessageBoxType from '../src/parts/ElectronMessageBoxType/ElectronMessageBoxType.js'

beforeEach(() => {
  jest.resetModules()
})

jest.unstable_mockModule('electron', () => {
  return {
    dialog: {
      showMessageBox: jest.fn(),
    },
    BrowserWindow: {
      getFocusedWindow() {
        return {}
      },
    },
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    applicationName: 'test-app',
    productNameLong: 'Test App',
  }
})

const ElectronDialog = await import('../src/parts/ElectronDialog/ElectronDialog.js')
const Electron = await import('electron')

test.skip('showMessageBox', async () => {
  // @ts-expect-error
  Electron.dialog.showMessageBox.mockImplementation(() => {
    return {
      response: 1,
    }
  })
  await ElectronDialog.showMessageBox({
    message: 'test',
    buttons: ['copy', 'ok'],
    type: ElectronMessageBoxType.Info,
    detail: 'test detail',
  })
  expect(Electron.dialog.showMessageBox).toHaveBeenCalledTimes(1)
  expect(Electron.dialog.showMessageBox).toHaveBeenCalledWith(
    {},
    {
      buttons: ['copy', 'ok'],
      cancelId: 1,
      detail: 'test detail',
      message: 'test',
      noLink: true,
      title: 'Test App',
      type: 'info',
    },
  )
})
