import { jest } from '@jest/globals'

beforeEach(() => {
  Dialog.state.dialog = undefined
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule(
  '../src/parts/ElectronDialog/ElectronDialog.js',
  () => {
    return {
      showOpenDialog: jest.fn(() => {
        throw new Error('not implemented')
      }),
      showMessageBox: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: 'test',
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)
const Command = await import('../src/parts/Command/Command.js')
const Platform = jest.requireMock('../src/plarts/Platform/Platform.js')
const Dialog = await import('../src/parts/Dialog/Dialog.js')
const ElectronDialog = await import(
  '../src/parts/ElectronDialog/ElectronDialog.js'
)

// TODO would need to test different platforms

test.skip('openFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return ['/tmp/some-folder']
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Dialog.openFolder()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    id: expect.any(Number),
    method: 8307,
    params: [],
  })
})

test('showAbout - electron', async () => {
  // @ts-ignore
  Platform.platform.mockImplementation(() => {
    return 'electron'
  })
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return null
  })
  await Dialog.showAbout()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Electron.about')
})

// TODO what if showErrorMessage results in error?
// Then showing error message would result in endless loop
// be careful and add test

test('showMessage - web', async () => {
  // @ts-ignore
  Platform.platform.mockImplementation(() => {
    return 'web'
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Dialog.showMessage(
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    []
  )
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Dialog.showErrorDialogWithOptions',
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    []
  )
})

test.only('showMessage - electron', async () => {
  // @ts-ignore
  mockPlatform.mockReturnValue('electron')
  // @ts-ignore
  ElectronDialog.showMessageBox.mockImplementation(() => {})
  await Dialog.showMessage(
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    []
  )
  expect(Dialog.state.dialog).toEqual({
    message: { codeFrame: '', message: 'Error: Oops', stack: '' },
    options: [],
  })
  expect(ElectronDialog.showMessageBox).toHaveBeenCalledTimes(1)
  expect(ElectronDialog.showMessageBox).toHaveBeenCalledWith({})
})

test('close - web', async () => {
  // @ts-ignore
  Platform.platform.mockImplementation(() => {
    return 'web'
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Dialog.showMessage(
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    []
  )
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Dialog.close()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(7836)
})

test('openFile - electron', async () => {
  // @ts-ignore
  Platform.platform.mockImplementation(() => {
    return 'electron'
  })
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  // @ts-ignore
  ElectronDialog.showOpenDialog.mockImplementation(() => {
    return ['/test/some-file']
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Dialog.openFolder()
  expect(ElectronDialog.showOpenDialog).toHaveBeenCalledTimes(1)
  expect(ElectronDialog.showOpenDialog).toHaveBeenCalledWith('Open Folder', [
    'openDirectory',
    'dontAddToRecent',
    'showHiddenFiles',
  ])
})
