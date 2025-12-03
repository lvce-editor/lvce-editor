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
