const ElectronMessageBoxType = require('../src/parts/ElectronMessageBoxType/ElectronMessageBoxType.js')

beforeEach(() => {
  jest.resetModules()
})

jest.mock('electron', () => {
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

jest.mock('../src/parts/Platform/Platform.js', () => {
  return {
    applicationName: 'test-app',
    ProductName: 'Test App',
  }
})

const ElectronDialog = require('../src/parts/ElectronDialog/ElectronDialog.js')
const Electron = require('electron')

test('showMessageBox', async () => {
  // @ts-ignore
  Electron.dialog.showMessageBox.mockImplementation(() => {
    return {
      response: 1,
    }
  })
  await ElectronDialog.showMessageBox('test', ['copy', 'ok'], ElectronMessageBoxType.Info, 'test detail')
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
    }
  )
})
