import { jest } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
})

// const SharedProcess = await import(
//   '../src/parts/SharedProcess/SharedProcess.js'
// )
// const Command = await import('../src/parts/Command/Command.js')

// const ElectronWindowAbout = await import(
//   '../src/parts/ElectronWindowAbout/ElectronWindowAbout.js'
// )

// TODO would need to test different platforms

test.skip('openFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return ['/tmp/some-folder']
  })
  const Dialog = await import('../src/parts/Dialog/Dialog.js')

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
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Electron,
    }
  })
  jest.unstable_mockModule(
    '../src/parts/ElectronWindowAbout/ElectronWindowAbout.js',
    () => {
      return {
        open: jest.fn(() => {}),
      }
    }
  )
  const ElectronWindowAbout = await import(
    '../src/parts/ElectronWindowAbout/ElectronWindowAbout.js'
  )
  const Dialog = await import('../src/parts/Dialog/Dialog.js')
  await Dialog.showAbout()
  expect(ElectronWindowAbout.open).toHaveBeenCalledTimes(1)
})

// TODO what if showErrorMessage results in error?
// Then showing error message would result in endless loop
// be careful and add test

test('showMessage - web', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Web,
    }
  })
  jest.unstable_mockModule(
    '../src/parts/RendererProcess/RendererProcess.js',
    () => {
      return {
        invoke: jest.fn(() => {}),
      }
    }
  )
  const RendererProcess = await import(
    '../src/parts/RendererProcess/RendererProcess.js'
  )
  const Dialog = await import('../src/parts/Dialog/Dialog.js')
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

test('showMessage - electron', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: 'electron',
    }
  })
  jest.unstable_mockModule(
    '../src/parts/ElectronDialog/ElectronDialog.js',
    () => {
      return {
        showMessageBox: jest.fn(() => {}),
      }
    }
  )
  const Dialog = await import('../src/parts/Dialog/Dialog.js')
  const ElectronDialog = await import(
    '../src/parts/ElectronDialog/ElectronDialog.js'
  )
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
  expect(ElectronDialog.showMessageBox).toHaveBeenCalledWith('Error: Oops', [])
})

test('close - web', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Web,
    }
  })
  jest.unstable_mockModule(
    '../src/parts/RendererProcess/RendererProcess.js',
    () => {
      return {
        invoke: jest.fn(),
      }
    }
  )
  const RendererProcess = await import(
    '../src/parts/RendererProcess/RendererProcess.js'
  )
  const Dialog = await import('../src/parts/Dialog/Dialog.js')
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
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: 'electron',
    }
  })
  jest.unstable_mockModule(
    '../src/parts/RendererProcess/RendererProcess.js',
    () => {
      return {
        invoke: jest.fn(),
      }
    }
  )
  jest.unstable_mockModule(
    '../src/parts/ElectronDialog/ElectronDialog.js',
    () => {
      return {
        showOpenDialog: jest.fn(() => {
          return ['/test/some-file']
        }),
        showMessageBox: jest.fn(() => {
          throw new Error('not implemented')
        }),
      }
    }
  )
  const RendererProcess = await import(
    '../src/parts/RendererProcess/RendererProcess.js'
  )

  jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
    return {
      execute: jest.fn(),
    }
  })

  const ElectronDialog = await import(
    '../src/parts/ElectronDialog/ElectronDialog.js'
  )
  const Dialog = await import('../src/parts/Dialog/Dialog.js')
  await Dialog.openFolder()
  expect(ElectronDialog.showOpenDialog).toHaveBeenCalledTimes(1)
  expect(ElectronDialog.showOpenDialog).toHaveBeenCalledWith('Open Folder', [
    'openDirectory',
    'dontAddToRecent',
    'showHiddenFiles',
  ])
})
