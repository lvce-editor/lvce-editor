import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ElectronMessageBoxType from '../src/parts/ElectronMessageBoxType/ElectronMessageBoxType.js'
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

// TODO what if showErrorMessage results in error?
// Then showing error message would result in endless loop
// be careful and add test

test('showMessage - electron', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Electron,
      getPlatform: jest.fn(() => {
        return PlatformType.Electron
      }),
      assetDir: '',
    }
  })
  jest.unstable_mockModule('../src/parts/ElectronDialog/ElectronDialog.js', () => {
    return {
      showMessageBox: jest.fn(() => {}),
    }
  })
  const Dialog = await import('../src/parts/Dialog/Dialog.js')
  const ElectronDialog = await import('../src/parts/ElectronDialog/ElectronDialog.js')
  // @ts-ignore
  ElectronDialog.showMessageBox.mockImplementation(() => {})
  await Dialog.showMessage(
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    [],
  )
  expect(Dialog.state.dialog).toEqual({
    message: { codeFrame: '', message: 'Error: Oops', stack: '' },
    options: [],
  })
  expect(ElectronDialog.showMessageBox).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(ElectronDialog.showMessageBox).toHaveBeenCalledWith('Error: Oops', [], ElectronMessageBoxType.Error)
})

test('openFile - web', async () => {
  const fileHandle = {
    kind: 'file',
    name: 'test.txt',
  }
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Web,
      getPlatform: jest.fn(() => {
        return PlatformType.Web
      }),
      assetDir: '',
    }
  })
  jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
    return {
      execute: jest.fn((command) => {
        if (command === 'FilePicker.showFilePicker') {
          return [fileHandle]
        }
        return undefined
      }),
    }
  })

  const Command = await import('../src/parts/Command/Command.js')
  const Dialog = await import('../src/parts/Dialog/Dialog.js')
  await Dialog.openFile()
  expect(Command.execute).toHaveBeenCalledTimes(3)
  expect(Command.execute).toHaveBeenNthCalledWith(1, 'FilePicker.showFilePicker', {
    multiple: false,
  })
  expect(Command.execute).toHaveBeenNthCalledWith(2, 'PersistentFileHandle.addHandle', 'html:///test.txt', fileHandle)
  expect(Command.execute).toHaveBeenNthCalledWith(3, 'Main.openUri', 'html:///test.txt', true, {})
})

test('openFile - web - canceled', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Web,
      getPlatform: jest.fn(() => {
        return PlatformType.Web
      }),
      assetDir: '',
    }
  })
  jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
    return {
      execute: jest.fn(() => {
        throw new DOMException('The user aborted a request.', 'AbortError')
      }),
    }
  })

  const Command = await import('../src/parts/Command/Command.js')
  const Dialog = await import('../src/parts/Dialog/Dialog.js')
  await Dialog.openFile()
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('FilePicker.showFilePicker', {
    multiple: false,
  })
})

test.skip('close - web', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Web,
      getPlatform: jest.fn(() => {
        return PlatformType.Web
      }),
      assetDir: '',
    }
  })
  jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
    return {
      invoke: jest.fn(),
    }
  })
  const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
  const Dialog = await import('../src/parts/Dialog/Dialog.js')
  await Dialog.showMessage(
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    [],
  )
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  await Dialog.close()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(7836)
})

test.each(['Error', 'TypeError', 'DockerNotInstalledError'])('showMessage maps prepared %s errors to dialog options', async (type) => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
    assetDir: '',
    getPlatform: () => PlatformType.Remote,
  }))
  jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => ({ openWidget: jest.fn() }))
  const Dialog = await import('../src/parts/Dialog/Dialog.js')
  const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
  const error = { message: 'DevContainerNode.cliUp failed with exit code 1', type }
  await Dialog.showMessage(error)
  expect(Viewlet.openWidget).toHaveBeenCalledWith('Dialog', { message: error.message, title: type, type: 'error' })
  expect(error.type).toBe(type)
})

test.each([0, 1, 2, undefined])('showMessageBox returns the selected option %s', async (response) => {
  const showMessageBox = jest.fn<(options: unknown) => Promise<number | undefined>>().mockResolvedValue(response)
  jest.unstable_mockModule('../src/parts/ElectronDialog/ElectronDialog.js', () => ({ showMessageBox }))
  const Dialog = await import('../src/parts/Dialog/Dialog.js')
  const options = {
    buttons: ['Commit Anyway', 'Cancel', 'Commit to a New Branch'],
    defaultId: 2,
    message: 'You are trying to commit to a protected branch.',
    type: 'warning',
  }
  const untrustedOptions = { ...options, productName: 'Untrusted title', windowId: 123 }
  const result = await Dialog.showMessageBox(untrustedOptions)
  expect(result).toBe(response)
  expect(showMessageBox).toHaveBeenCalledWith(options)
})
