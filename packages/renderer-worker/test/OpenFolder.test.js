import { beforeEach, expect, jest, test } from '@jest/globals'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
})

// TODO would need to test different platforms

test.skip('openFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return ['/tmp/some-folder']
  })
  const Dialog = await import('../src/parts/Dialog/Dialog.js')

  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  await Dialog.openFolder()
  // @ts-ignore
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(SharedProcess.invoke).toHaveBeenCalledWith({
    jsonrpc: JsonRpcVersion.Two,
    id: expect.any(Number),
    method: 8307,
    params: [],
  })
})

test('openFolder - electron', async () => {
  jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
    return {
      platform: PlatformType.Electron,
      getPlatform: jest.fn(() => {
        return PlatformType.Electron
      }),
      assetDir: '',
    }
  })
  jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
    return {
      invoke: jest.fn(),
    }
  })
  jest.unstable_mockModule('../src/parts/ElectronDialog/ElectronDialog.js', () => {
    return {
      showOpenDialog: jest.fn(() => {
        return ['/test/some-file']
      }),
      showMessageBox: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  })

  jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
    return {
      execute: jest.fn(),
    }
  })

  const ElectronDialog = await import('../src/parts/ElectronDialog/ElectronDialog.js')
  const OpenFolder = await import('../src/parts/OpenFolder/OpenFolder.js')
  await OpenFolder.openFolder()
  expect(ElectronDialog.showOpenDialog).toHaveBeenCalledTimes(1)
  expect(ElectronDialog.showOpenDialog).toHaveBeenCalledWith('Open Folder', ['openDirectory', 'dontAddToRecent', 'showHiddenFiles'])
})
