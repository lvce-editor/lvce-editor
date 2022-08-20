jest.mock('electron', () => {
  return {
    dialog: {
      showOpenDialog: jest.fn(),
    },
    BrowserWindow: {
      getFocusedWindow() {
        return {}
      },
    },
  }
})

const Dialog = require('../src/parts/Dialog/Dialog.js')

const electron = require('electron')

test.only('showOpenDialog', async () => {
  // @ts-ignore
  electron.dialog.showOpenDialog.mockImplementation(() => {
    return {
      canceled: false,
      filePaths: ['/test'],
    }
  })
  expect(await Dialog.showOpenDialog('Open Folder')).toEqual(['/test'])
  expect(electron.dialog.showOpenDialog).toHaveBeenCalledTimes(1)
  expect(electron.dialog.showOpenDialog).toHaveBeenCalledWith(
    {},
    {
      properties: ['openDirectory', 'dontAddToRecent', 'showHiddenFiles'],
      title: 'Open Folder',
    }
  )
})

test('showOpenDialog - canceled', async () => {
  // @ts-ignore
  electron.dialog.showOpenDialog.mockImplementation(() => {
    return {
      canceled: true,
      filePaths: [],
    }
  })
  expect(await Dialog.showOpenDialog('Open Folder')).toBeUndefined()
})
